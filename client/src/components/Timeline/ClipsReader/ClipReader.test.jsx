import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClipsReader } from './ClipsReader';
import * as storeHooks from '@/store';
import userEvent from '@testing-library/user-event';

// Mocking the store hooks
vi.mock('@/store', () => ({
  useClips: vi.fn(),
  usePlayHeadPosition: vi.fn(),
  useFetchProjects: vi.fn(),
  useStatus: vi.fn(),
  useError: vi.fn(),
  useSelectedClipId: vi.fn(),
  useSetSelectedClipId: vi.fn(),
  useMoveClip: vi.fn(),
}));

vi.mock('./Clip', () => ({
  Clip: ({ name }) => <div data-testid="mock-clip">{name}</div>,
}));

describe('ClipsReader', () => {
  const mockFetchProjects = vi.fn().mockResolvedValue([]);
  const mockMoveClip = vi.fn();
  const mockSetSelectedClipId = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    storeHooks.useClips.mockReturnValue([]);
    storeHooks.usePlayHeadPosition.mockReturnValue(0);
    storeHooks.useFetchProjects.mockReturnValue(mockFetchProjects);
    storeHooks.useStatus.mockReturnValue('idle');
    storeHooks.useError.mockReturnValue(null);
    storeHooks.useSelectedClipId.mockReturnValue(null);
    storeHooks.useSetSelectedClipId.mockReturnValue(mockSetSelectedClipId);
    storeHooks.useMoveClip.mockReturnValue(mockMoveClip);
  });

  it('should fetch projects on mount', () => {
    render(<ClipsReader />);
    expect(mockFetchProjects).toHaveBeenCalledTimes(1);
  });

  it('should render loading spinner when status is loading', () => {
    storeHooks.useStatus.mockReturnValue('loading');
    render(<ClipsReader />);

    expect(document.querySelector('.animate-spin')).toBeDefined();
  });

  it('should render error message and `Try again` button on error', async () => {
    const user = userEvent.setup();
    storeHooks.useError.mockReturnValue('Fetch failed');
    render(<ClipsReader />);

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /try again/i });

    await user.click(retryButton);
    expect(mockFetchProjects).toHaveBeenCalledTimes(2);
  });

  it('should render `No clips found` when clips array is empty', () => {
    storeHooks.useStatus.mockReturnValue('success');
    storeHooks.useClips.mockReturnValue([]);
    render(<ClipsReader />);

    expect(screen.getByText(/no clips found/i)).toBeInTheDocument();
  });

  it('should render list of clips and playhead', () => {
    storeHooks.useClips.mockReturnValue([
      { id: '1', name: 'Clip 1' },
      { id: '2', name: 'Clip 2' },
    ]);
    storeHooks.usePlayHeadPosition.mockReturnValue(50);

    render(<ClipsReader />);

    expect(screen.getByText('Clip 1')).toBeInTheDocument();
    expect(screen.getByText('Clip 2')).toBeInTheDocument();

    // Check if playhead is at 50%
    const playhead = document.querySelector('.bg-red-500');
    expect(playhead.style.left).toBe('50%');
  });

  it('should handle keyboard navigation (ArrowLeft/ArrowRight) when a clip is selected', async () => {
    const user = userEvent.setup();
    storeHooks.useSelectedClipId.mockReturnValue('clip-1');
    storeHooks.useClips.mockReturnValue([{ id: 'clip-1', name: 'Clip 1' }]);

    render(<ClipsReader />);

    await user.keyboard('[ArrowRight]');
    expect(mockMoveClip).toHaveBeenCalledWith('right');

    await user.keyboard('[ArrowLeft]');

    expect(mockMoveClip).toHaveBeenCalledWith('left');
  });

  it('should NOT move clip if an input field is focused', () => {
    const user = userEvent.setup();
    storeHooks.useSelectedClipId.mockReturnValue('clip-1');
    render(<ClipsReader />);

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    user.keyboard('[ArrowRight]');

    expect(mockMoveClip).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });
});
