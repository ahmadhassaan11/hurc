declare module 'klaro' {
  export type KlaroPurpose = string;

  export type KlaroService = {
    name: string;
    title?: string;
    description?: string;
    purposes: KlaroPurpose[];
    required?: boolean;
    default?: boolean;
    optOut?: boolean;
    onlyOnce?: boolean;
    cookies?: (string | RegExp | [string | RegExp, string?, string?])[];
    callback?: (consent: boolean, service: KlaroService) => void;
  };

  export type KlaroTranslation = Record<string, unknown>;

  export type KlaroConfig = {
    version?: number;
    elementID?: string;
    storageMethod?: 'cookie' | 'localStorage';
    storageName?: string;
    cookieName?: string;
    cookieExpiresAfterDays?: number;
    cookieDomain?: string;
    cookiePath?: string;
    htmlTexts?: boolean;
    embedded?: boolean;
    groupByPurpose?: boolean;
    default?: boolean;
    mustConsent?: boolean;
    acceptAll?: boolean;
    hideDeclineAll?: boolean;
    hideLearnMore?: boolean;
    noticeAsModal?: boolean;
    disablePoweredBy?: boolean;
    lang?: string;
    services: KlaroService[];
    translations?: Record<string, KlaroTranslation>;
    additionalClass?: string;
    autoFocus?: boolean;
  };

  export type KlaroWatcher = {
    update: (
      manager: KlaroManager,
      eventName: 'applyConsents' | 'consents' | string,
      data: unknown,
    ) => void;
  };

  export type KlaroManager = {
    consents: Record<string, boolean>;
    watch(watcher: KlaroWatcher): void;
    unwatch(watcher: KlaroWatcher): void;
    changeAll(value: boolean): void;
    updateConsent(name: string, value: boolean): void;
    saveAndApplyConsents(): void;
    getConsent(name: string): boolean;
    confirmed: boolean;
  };

  export function setup(config: KlaroConfig): void;
  export function show(config?: KlaroConfig, modal?: boolean): void;
  export function getManager(config?: KlaroConfig): KlaroManager;
  export function version(): string;
  export function render(config: KlaroConfig, opts?: unknown): unknown;
}

declare module 'klaro/dist/klaro.css';
