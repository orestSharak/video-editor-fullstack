import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Placeholder } from './Placeholder';

describe('Placeholder', () => {
  it('should render the component correctly', () => {
    render(<Placeholder />);

    const previewText = screen.getByText(/preview area/i);
    expect(previewText).toBeInTheDocument();
  });
});
