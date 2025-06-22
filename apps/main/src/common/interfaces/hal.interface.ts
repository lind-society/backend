export interface ILinkHal {
  href: string;
  title?: string;
}

export interface IHalEmbededConfig {
  name: string;
  path: string;
}

export interface IHalResource<T = any> {
  _links: Record<string, ILinkHal>;
  _embedded?: Record<string, IHalResource | IHalResource[]>;
  [key: string]: any;
}
