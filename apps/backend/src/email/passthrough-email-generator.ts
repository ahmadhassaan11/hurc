import type { EmailGenerator } from '@vendure/email-plugin';

/**
 * Body comes pre-rendered to HTML by ReactEmailTemplateLoader, so this
 * generator only interpolates `{{ key.path }}` into the subject line. We
 * deliberately do not handlebars-render the body — its HTML may legitimately
 * contain `{{` from CSS / data, and the React template owns its own
 * substitutions.
 */
const SUBJECT_INTERPOLATION = /\{\{\s*([\w.]+)\s*\}\}/g;

function lookup(vars: Record<string, unknown>, path: string): unknown {
  const segments = path.split('.');
  let value: unknown = vars;
  for (const segment of segments) {
    if (value === null || value === undefined) return undefined;
    value = (value as Record<string, unknown>)[segment];
  }
  return value;
}

export class PassthroughEmailGenerator implements EmailGenerator {
  generate(
    from: string,
    subject: string,
    body: string,
    templateVars: Record<string, unknown>,
  ): { from: string; subject: string; body: string } {
    const renderedSubject = subject.replace(SUBJECT_INTERPOLATION, (_, path: string) => {
      const v = lookup(templateVars, path);
      return v === null || v === undefined ? '' : String(v);
    });
    return { from, subject: renderedSubject, body };
  }
}
