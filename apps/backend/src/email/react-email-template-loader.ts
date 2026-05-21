import type { Injector, RequestContext } from '@vendure/core';
import type { LoadTemplateInput, TemplateLoader } from '@vendure/email-plugin';

import {
  type EmailTemplateMap,
  isKnownEmailTemplate,
  renderEmailByType,
} from '../email-templates/render.js';

/**
 * TemplateLoader that ignores filesystem templates and renders React Email
 * components by `type` (the string passed to `new EmailEventListener(type)`).
 *
 * The EmailPlugin pipeline expects loadTemplate → string → emailGenerator →
 * EmailDetails.body. Because we render to final HTML here, the generator can
 * be a passthrough (see PassthroughEmailGenerator).
 */
export class ReactEmailTemplateLoader implements TemplateLoader {
  async loadTemplate(
    _injector: Injector,
    _ctx: RequestContext,
    input: LoadTemplateInput,
  ): Promise<string> {
    const { type, templateVars } = input;
    if (!isKnownEmailTemplate(type)) {
      throw new Error(
        `No React Email template registered for type "${type}". ` +
          'Register it in src/email-templates/render.ts.',
      );
    }
    // The EmailEventHandler's setTemplateVars contract is what guarantees the
    // shape of `templateVars` matches the template's props. Vendure's API
    // erases the type at this seam, so we narrow per-template at the registry.
    return renderEmailByType(type, templateVars as EmailTemplateMap[typeof type]);
  }
}
