import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InfoBox } from './InfoBox';
import * as storeHooks from '@/store';

vi.mock('@/store', () => ({
  useClips: vi.fn(),
  usePlayHeadPosition: vi.fn(),
}));

describe('InfoBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render `no active clips`', () => {
    storeHooks.useClips.mockReturnValue([{ id: '1', name: 'Clip 1', startTime: 10, duration: 5 }]);
    storeHooks.usePlayHeadPosition.mockReturnValue(5);

    render(<InfoBox />);

    expect(screen.getByText(/no active clips/i)).toBeInTheDocument();
  });

  it('should render clip name when play head is on it', () => {
    storeHooks.useClips.mockReturnValue([{ id: '1', name: 'Clip 1', startTime: 10, duration: 5 }]);
    // Play head position on 12, means on clip length
    storeHooks.usePlayHeadPosition.mockReturnValue(12);

    render(<InfoBox />);

    expect(screen.getByText(/currently playing/i)).toBeInTheDocument();
    expect(screen.getByText('Clip 1')).toBeInTheDocument();
  });

  it('should render multiple clips', () => {
    storeHooks.useClips.mockReturnValue([
      { id: '1', name: 'Clip 1', startTime: 0, duration: 100 },
      { id: '2', name: 'Clip 2', startTime: 10, duration: 10 },
    ]);
    storeHooks.usePlayHeadPosition.mockReturnValue(15);

    render(<InfoBox />);

    expect(screen.getByText('Clip 1')).toBeInTheDocument();
    expect(screen.getByText('Clip 2')).toBeInTheDocument();
  });

  it('should not render clip when the play head is exactly on the clip end', () => {
    storeHooks.useClips.mockReturnValue([{ id: '1', name: 'Clip 1', startTime: 10, duration: 5 }]);
    // start + duration (10 + 5)
    storeHooks.usePlayHeadPosition.mockReturnValue(15);

    render(<InfoBox />);

    expect(screen.getByText(/no active clips/i)).toBeInTheDocument();
    expect(screen.queryByText('Clip 1')).not.toBeInTheDocument();
  });
});
