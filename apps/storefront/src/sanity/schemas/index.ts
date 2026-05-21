import type { SchemaTypeDefinition } from 'sanity';

import { activity } from './activity';
import { homepage } from './homepage';
import { journalPost } from './journalPost';
import { portableTextBody } from './objects/portableTextBody';
import { seo } from './objects/seo';
import { page } from './page';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  homepage,
  page,
  journalPost,
  activity,
  // Objects
  seo,
  portableTextBody,
];
