import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TimelineInfo } from './TimelineInfo';
import * as storeHooks from '@/store';

vi.mock('@/store', () => ({
  usePlayHeadPosition: vi.fn(),
}));

describe('TimelineInfo', () => {
  it('should display the correct play head position with "s" unit', () => {
    storeHooks.usePlayHeadPosition.mockReturnValue(45);
    render(<TimelineInfo />);

    expect(screen.getByText('Position: 45s')).toBeInTheDocument();
  });

  it('should display 0s when play head position is at the beginning', () => {
    storeHooks.usePlayHeadPosition.mockReturnValue(0);
    render(<TimelineInfo />);

    expect(screen.getByText('Position: 0s')).toBeInTheDocument();
  });
});
