/**
 * Scalar TS mappings shared between admin-api and shop-api codegen.
 *
 * Keep in sync with `codegen.ts#scalars`. Vendure's stock scalars (`DateTime`,
 * `Money`, `JSON`, `Upload`) map to native TS primitives so the generated
 * operation types are immediately usable. `Money` is integer minor units
 * (CLAUDE.md §8); format only at the edge.
 */
export type DateTimeScalar = string;
export type MoneyScalar = number;
export type JSONScalar = unknown;
export type UploadScalar = File;
