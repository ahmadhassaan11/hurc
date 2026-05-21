import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Avatar, AvatarFallback, AvatarImage } from '../../src/primitives/avatar';

describe('Avatar', () => {
  it('renders the fallback when image is absent', () => {
    render(
      <Avatar>
        <AvatarImage src="" alt="" />
        <AvatarFallback>AH</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('AH')).toBeDefined();
  });

  it('passes axe', async () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AH</AvatarFallback>
      </Avatar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
