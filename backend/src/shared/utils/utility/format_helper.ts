export class FormatHelper {
  static readonly SENSITIVE_KEYS = new Set([
    'password',
    // 'refreshToken',
    // 'accessToken',
    // 'token',
  ]);

  static isPresent<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }

  static isNotEmpty(value: unknown): boolean {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !Number.isNaN(value);
    if (typeof value === 'boolean') return true;

    if (value instanceof Date) return !Number.isNaN(value.getTime());
    if (Array.isArray(value)) return value.length > 0;
    if (value instanceof Map || value instanceof Set) return value.size > 0;

    if (!this.isPresent(value)) return false;
    if (typeof value === 'object') return Object.keys(value!).length > 0;
    return true;
  }

  static serializeItem(item: any) {
    if (!item || typeof item !== 'object') return item;

    const v = item.toMap;

    // getter `toMap` (object)
    if (v && typeof v === 'object') return this.stripSensitive(v);

    // method `toMap()` (function)
    if (typeof v === 'function') return this.stripSensitive(v.call(item));

    // fallback: plain object -> snake_case keys
    return this.stripSensitive(this.toSnakeCaseObject(item));
  }

  static serializeData(data: any) {
    if (Array.isArray(data)) {
      return data.map((item) => this.serializeItem(item));
    }
    return this.serializeItem(data);
  }

  static toSnake = (s: string) =>
    s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

  // arrow = aman buat recursion (nggak kehilangan this)
  static toSnakeCaseObject = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(FormatHelper.toSnakeCaseObject);
    if (!obj || typeof obj !== 'object') return obj;

    if (obj instanceof Date) return obj;

    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        FormatHelper.toSnake(k),
        FormatHelper.toSnakeCaseObject(v),
      ]),
    );
  };

  // arrow = aman juga
  static stripSensitive = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(FormatHelper.stripSensitive);
    if (!obj || typeof obj !== 'object') return obj;

    if (obj instanceof Date) return obj;

    const entries = Object.entries(obj).filter(
      ([k]) => !FormatHelper.SENSITIVE_KEYS.has(k),
    );

    return Object.fromEntries(
      entries.map(([k, v]) => [k, FormatHelper.stripSensitive(v)]),
    );
  };

  static pad(n: number) {
    return String(n).padStart(2, '0');
  }

  static formatDate(d: Date) {
    const yyyy = d.getFullYear();
    const mm = this.pad(d.getMonth() + 1);
    const dd = this.pad(d.getDate());
    const hh = this.pad(d.getHours());
    const mi = this.pad(d.getMinutes());
    const ss = this.pad(d.getSeconds());
    return `${dd}${mm}${yyyy}-${hh}${mi}${ss}`;
  }

  static sanitizeBaseName(name: string) {
    // hilangkan karakter aneh, spasi jadi underscore
    return name
      .replace(/\.[^/.]+$/, '') // buang ekstensi
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_-]/g, '');
  }

  static isPhoneNoLeadingZero(value: string): boolean {
    return /^(\+62|62)8[1-9][0-9]{6,11}$/.test(value);
  }

  static isEmail(value: string): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  }
}
