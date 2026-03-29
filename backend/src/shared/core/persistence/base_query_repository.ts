import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

export abstract class BaseQueryRepository<T extends ObjectLiteral> {
  protected abstract get db(): Repository<T>;

  protected pickRawValue(rawRow: any, qbAlias: string, selectAlias: string) {
    if (!rawRow) return undefined;

    if (rawRow[selectAlias] !== undefined) return rawRow[selectAlias];

    const prefixed = `${qbAlias}_${selectAlias}`;
    if (rawRow[prefixed] !== undefined) return rawRow[prefixed];

    const foundKey = Object.keys(rawRow).find(
      (k) => k === selectAlias || k.endsWith(`_${selectAlias}`),
    );
    if (foundKey) return rawRow[foundKey];

    return undefined;
  }

  protected toNumberOrZero(v: any): number {
    if (v === null || v === undefined || v === '') return 0;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  protected mapComputedFields(
    raw: any[],
    entities: T[],
    qbAlias: string,
    aliases: string[],
  ) {
    entities.forEach((entity, i) => {
      const row = raw[i] ?? {};
      for (const alias of aliases) {
        const value = this.pickRawValue(row, qbAlias, alias);
        (entity as any)[alias] = this.toNumberOrZero(value);
      }
    });
  }

  protected async getManyWithComputed(
    qb: SelectQueryBuilder<T>,
    aliases: string[],
  ): Promise<T[]> {
    const { raw, entities } = await qb.getRawAndEntities();
    this.mapComputedFields(raw, entities, qb.alias, aliases);
    return entities;
  }

  protected async getOneWithComputed(
    qb: SelectQueryBuilder<T>,
    aliases: string[],
  ): Promise<T | null> {
    const { raw, entities } = await qb.getRawAndEntities();
    if (!entities.length) return null;

    this.mapComputedFields(raw, entities, qb.alias, aliases);
    return entities[0] ?? null;
  }
}