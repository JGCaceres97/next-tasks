export interface Settings {
  APP_VERSION?: string;
  IS_DEVELOPMENT: (host?: string) => boolean;
}
