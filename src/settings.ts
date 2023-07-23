import { Environment } from '@/lib/enums';
import { Settings } from '@/types/Settings';

export const settings: Settings = {
  APP_VERSION: process.env['npm_package_version'],
  IS_DEVELOPMENT: host =>
    process.env.NODE_ENV === Environment.DEVELOPMENT ||
    !!(host && RegExp(Environment.LOCALHOST, 'i').test(host))
};
