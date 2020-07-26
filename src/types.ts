export type TConstructorFunction<T> = {
  new (...args: unknown[]): T;
  [key: string]: unknown;
};

// deno-lint-ignore no-explicit-any
export type Constructor<T extends {}> = new (...args: any[]) => T;

export type Mocked<T> = T & {
  calls: { [k in keyof T]: T[k] extends Function ? number : never };
  is_mock: true;
};

export type Stubbed<T> = T & {
  calls: { [k in keyof T]?: T[k] extends Function ? number : never };
};
