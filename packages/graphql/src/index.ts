/**
 * @hurc/graphql — typed Vendure operations.
 *
 * Consumers should import from the `./admin` or `./shop` subpath exports;
 * this root entry exposes shared scalar mappings and a package marker.
 */

export const PACKAGE_NAME = '@hurc/graphql' as const;

export type { DateTimeScalar, JSONScalar, MoneyScalar, UploadScalar } from './scalars.js';
