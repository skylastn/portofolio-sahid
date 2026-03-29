// pagination_utility.ts
import {
  FindManyOptions,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { PaginationResponse } from '../../core/model/response/pagination_response';
import { PaginationRequest } from '../../core/model/request/pagination_request';

export type QbModifier<T extends ObjectLiteral> = (
  qb: SelectQueryBuilder<T>,
) => void;

/**
 * Try to read a computed select value from raw row.
 * TypeORM raw keys can be:
 * - "total_claim"
 * - "<alias>_total_claim"
 * - sometimes quoted / different casing depending on driver
 *
 * This helper is dynamic (doesn't hardcode parent/root alias).
 */
function pickRawValue(rawRow: any, qbAlias: string, selectAlias: string) {
  if (!rawRow) return undefined;

  // 1) direct key
  if (rawRow[selectAlias] !== undefined) return rawRow[selectAlias];

  // 2) prefixed by qb root alias
  const prefixed = `${qbAlias}_${selectAlias}`;
  if (rawRow[prefixed] !== undefined) return rawRow[prefixed];

  // 3) fallback: find any key that ends with _<selectAlias>
  const foundKey = Object.keys(rawRow).find(
    (k) => k === selectAlias || k.endsWith(`_${selectAlias}`),
  );
  if (foundKey) return rawRow[foundKey];

  return undefined;
}

function toNumberOrZero(v: any): number {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * paginateRepo
 * - Default path: repo.findAndCount (paling stabil, cocok untuk where/order biasa)
 * - If modifyQb provided: use QueryBuilder (untuk EXISTS/join/custom SQL)
 *
 * Notes:
 * - Avoid alias conflicts with setFindOptions by NOT forcing alias name.
 * - For custom SQL, always refer to qb.alias (root alias).
 * - For computed fields (qb.addSelect(expr, 'alias')), this function will try to map raw result
 *   back onto entity automatically (best-effort).
 */
export async function paginateRepo<T extends ObjectLiteral>(
  repo: Repository<T>,
  params: PaginationRequest,
  options: FindManyOptions<T> = {},
  modifyQb?: QbModifier<T>,
): Promise<PaginationResponse<T>> {
  const safePage = Math.max(1, Number(params.page) || 1);
  const safePerPage = Math.min(Math.max(1, Number(params.perPage) || 10), 100);

  // ✅ stable path (no custom qb needed)
  if (!modifyQb) {
    const [data, total] = await repo.findAndCount({
      ...options,
      skip: (safePage - 1) * safePerPage,
      take: safePerPage,
    });

    const lastPage = Math.max(1, Math.ceil(total / safePerPage));
    return {
      status: true,
      message: 'Success',
      currentPage: safePage,
      perPage: safePerPage,
      total,
      data,
      meta: { first: 1, last: lastPage },
    };
  }

  // ✅ custom path (EXISTS/join/etc.)
  // IMPORTANT: don't pass alias string here, to avoid alias mismatch in setFindOptions
  const qb = repo.createQueryBuilder(); // alias = qb.alias
  qb.setFindOptions({ ...options });

  // let caller add joins / addSelect / where etc.
  modifyQb(qb);

  // clone BEFORE paging
  const countQb = qb.clone();

  // apply paging only to main qb
  qb.skip((safePage - 1) * safePerPage).take(safePerPage);

  // execute entities + raw
  const { raw, entities } = await qb.getRawAndEntities();

  // execute count (without paging)
  const total = await countQb.getCount();

  /**
   * Auto-map computed fields (best-effort):
   * We scan raw[0] keys and map:
   * - if key is "total_claim" => entities[i].total_claim
   * - if key endsWith "_total_claim" => entities[i].total_claim
   *
   * This avoids hardcoding the parent/root alias.
   */
  if (raw && raw.length > 0) {
    const qbAlias = qb.alias;

    // Collect computed-ish aliases from raw keys (excluding obvious entity columns like "<alias>_id")
    // Strategy:
    // - include keys that do NOT start with "<qbAlias>_" (those are often computed aliases)
    // - also include keys that end with computed suffix but are prefixed (e.g. "<qbAlias>_total_claim")
    //
    // We'll just map any key that is not a base entity column if it looks like a computed one.
    const rawKeys = Object.keys(raw[0] ?? {});
    const basePrefix = `${qbAlias}_`;

    // Heuristic: computed candidates are:
    // - keys without basePrefix, OR
    // - keys with basePrefix but the remainder is not a real column (we can't know reliably)
    // We'll still allow mapping for both direct + prefixed, but we will set property name = alias part.
    const computedAliases = new Set<string>();

    for (const k of rawKeys) {
      if (!k) continue;

      if (k.startsWith(basePrefix)) {
        // possible: v_total_claim OR v_id
        const tail = k.slice(basePrefix.length);
        // We'll include tail as candidate, because user wants dynamic.
        // If tail collides with real column name, setting it again is harmless.
        computedAliases.add(tail);
      } else {
        // direct computed alias
        computedAliases.add(k);
      }
    }

    // Merge row by row
    entities.forEach((e, i) => {
      const r: any = raw[i] ?? {};

      for (const aliasName of computedAliases) {
        // Skip very common base columns you don't want to override (optional)
        // if (aliasName === 'id' || aliasName === 'createdAt' || aliasName === 'updatedAt') continue;

        const v = pickRawValue(r, qbAlias, aliasName);

        // assign:
        // - If it's numeric-like, store number
        // - Else store as-is
        if (v !== undefined) {
          // many DB drivers return counts as string => convert
          const looksNumeric =
            typeof v === 'number' ||
            (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)));

          (e as any)[aliasName] = looksNumeric ? toNumberOrZero(v) : v;
        }
      }
    });
  }

  const lastPage = Math.max(1, Math.ceil(total / safePerPage));
  return {
    status: true,
    message: 'Success',
    currentPage: safePage,
    perPage: safePerPage,
    total,
    data: entities,
    meta: { first: 1, last: lastPage },
  };
}

/**
 * Helper for building EXISTS filter without guessing root alias:
 */
export function rootAlias<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>) {
  return qb.alias;
}