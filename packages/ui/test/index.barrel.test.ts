import { describe, expect, it } from 'vitest';

import * as ui from '../src';

const REQUIRED_EXPORTS = [
  // lib
  'cn',
  'cva',
  // no-radix primitives
  'Button',
  'buttonVariants',
  'Link',
  'linkVariants',
  'Badge',
  'badgeVariants',
  'Skeleton',
  'skeletonVariants',
  // form
  'Input',
  'inputVariants',
  'Textarea',
  'textareaVariants',
  'Label',
  'Field',
  // toggles
  'Checkbox',
  'RadioGroup',
  'RadioGroupItem',
  'Switch',
  // modals
  'Select',
  'SelectTrigger',
  'SelectContent',
  'SelectItem',
  'Dialog',
  'DialogTrigger',
  'DialogContent',
  'DialogTitle',
  'Sheet',
  'SheetTrigger',
  'SheetContent',
  'SheetTitle',
  // menus
  'DropdownMenu',
  'DropdownMenuTrigger',
  'DropdownMenuContent',
  'DropdownMenuItem',
  'Popover',
  'PopoverTrigger',
  'PopoverContent',
  'TooltipProvider',
  'Tooltip',
  'TooltipTrigger',
  'TooltipContent',
  // layout
  'Accordion',
  'AccordionItem',
  'AccordionTrigger',
  'AccordionContent',
  'Tabs',
  'TabsList',
  'TabsTrigger',
  'TabsContent',
  'Avatar',
  'AvatarImage',
  'AvatarFallback',
  'Separator',
  // pagination
  'Pagination',
  'PaginationContent',
  'PaginationItem',
  'PaginationLink',
  'PaginationPrevious',
  'PaginationNext',
  'PaginationEllipsis',
  // toast
  'Toaster',
  'toast',
] as const;

describe('@hurc/ui barrel', () => {
  it.each(REQUIRED_EXPORTS)('exports %s', (name) => {
    expect((ui as Record<string, unknown>)[name]).toBeDefined();
  });
});
