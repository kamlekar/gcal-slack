interface AwesompleteOptions {
  minChars?: number;
  maxItems?: number;
  autoFirst?: boolean;
  list?: string | string[];
  data?: (text: string, input: string) => string[];
  filter?: (text: string, input: string) => boolean;
  item?: (text: string, input: string) => HTMLElement;
  replace?: (text: string) => void;
}

interface AwesompleteStatic {
  FILTER_CONTAINS: (text: string, input: string) => boolean;
  ITEM: (text: string, input: string) => HTMLElement;
  new (input: HTMLElement, options?: AwesompleteOptions): Awesomplete;
}

export interface Awesomplete {
  input: HTMLInputElement;
  ul: HTMLElement;
  minChars: number;
  evaluate(): void;
  open(): void;
  close(): void;
}

interface SweetAlert2 {
  fire: (
    title: string,
    text: string,
    icon: "success" | "error"
  ) => Promise<void>;
}

declare global {
  interface Window {
    Awesomplete: AwesompleteStatic;
    Swal: SweetAlert2;
  }
}

export {};
