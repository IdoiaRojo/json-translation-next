export interface Translation {
  [key: string]:
    | {
        [key: string]: any;
      }
    | string;
}
