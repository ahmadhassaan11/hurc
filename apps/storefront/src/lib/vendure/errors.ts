export type GraphQLErrorPayload = {
  message: string;
  extensions?: Record<string, unknown>;
  path?: readonly (string | number)[];
};

export type GraphQLClientErrorReason =
  | { kind: 'http'; status: number; statusText?: string }
  | { kind: 'network'; cause: unknown }
  | { kind: 'graphql'; errors: GraphQLErrorPayload[] }
  | { kind: 'malformed'; cause: unknown };

export class GraphQLClientError extends Error {
  readonly reason: GraphQLClientErrorReason;

  constructor(reason: GraphQLClientErrorReason) {
    super(messageFor(reason));
    this.name = 'GraphQLClientError';
    this.reason = reason;
  }
}

function messageFor(reason: GraphQLClientErrorReason): string {
  switch (reason.kind) {
    case 'http':
      return `Vendure HTTP ${String(reason.status)}${reason.statusText ? ` ${reason.statusText}` : ''}`;
    case 'network':
      return 'Vendure network error';
    case 'graphql':
      return `Vendure GraphQL error: ${reason.errors.map((e) => e.message).join('; ')}`;
    case 'malformed':
      return 'Vendure response was not valid JSON';
  }
}
