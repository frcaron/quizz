export function notNullOrUndefined<T>(obj: T | null | undefined): obj is T {
  return obj !== null && obj !== undefined;
}

export function generateId(): string {
  return '_' + Math.random().toString(36).substr(2, 9);
}

export function isString(obj: unknown): obj is string {
  return typeof obj === 'string';
}

export function isArray<T>(obj: unknown): obj is Array<T> {
  return Array.isArray(obj);
}