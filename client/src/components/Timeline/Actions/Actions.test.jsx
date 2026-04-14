import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Actions } from './Actions';
import * as storeHooks from '@/store';

vi.mock('@/store', () => ({
  useClips: vi.fn(),
  usePlayHeadPosition: vi.fn(),
  useSelectedClipId: vi.fn(),
  useAddClip: vi.fn(),
  useSplitClip: vi.fn(),
  useUndo: vi.fn(),
  useRedo: vi.fn(),
  useCanUndo: vi.fn(),
  useCanRedo: vi.fn(),
}));

vi.mock('@/components', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    TooltipProvider: ({ children }) => <>{children}</>,
    Tooltip: ({ children }) => <>{children}</>,
    TooltipTrigger: ({ children }) => <>{children}</>,
    TooltipContent: ({ children }) => <>{children}</>,
  };
});

describe('Actions', () => {
  const mockAddClip = vi.fn();
  const mockSplitClip = vi.fn();
  const mockUndo = vi.fn();
  const mockRedo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    storeHooks.useClips.mockReturnValue([]);
    storeHooks.usePlayHeadPosition.mockReturnValue(0);
    storeHooks.useSelectedClipId.mockReturnValue(null);
    storeHooks.useAddClip.mockReturnValue(mockAddClip);
    storeHooks.useSplitClip.mockReturnValue(mockSplitClip);
    storeHooks.useUndo.mockReturnValue(mockUndo);
    storeHooks.useRedo.mockReturnValue(mockRedo);
    storeHooks.useCanUndo.mockReturnValue(false);
    storeHooks.useCanRedo.mockReturnValue(false);
  });

  it('should render all action buttons', () => {
    render(<Actions />);

    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /split clip/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add clip/i })).toBeInTheDocument();
  });

  it('should call addClip with correct parameters when clicking `Add Clip`', async () => {
    const user = userEvent.setup();
    storeHooks.usePlayHeadPosition.mockReturnValue(50);
    storeHooks.useClips.mockReturnValue([{ id: '1' }]);

    render(<Actions />);

    const addButton = screen.getByRole('button', { name: /add clip/i });
    await user.click(addButton);

    expect(mockAddClip).toHaveBeenCalledWith(
      expect.objectContaining({
        // The Clip-1 exist and this is newly added one with Clip-2
        name: 'Clip-2',
        startTime: 50,
      }),
    );
  });

  it('should disable Split button when no clip is selected', () => {
    storeHooks.useSelectedClipId.mockReturnValue(null);
    render(<Actions />);

    const splitButton = screen.getByRole('button', { name: /split clip/i });

    expect(splitButton).toBeDisabled();
  });

  it('should enable Split button when a clip is selected', () => {
    storeHooks.useSelectedClipId.mockReturnValue('clip-1');
    render(<Actions />);

    const splitButton = screen.getByRole('button', { name: /split clip/i });

    expect(splitButton).not.toBeDisabled();
  });

  it('should call undo and redo when buttons are clicked', async () => {
    const user = userEvent.setup();
    storeHooks.useCanUndo.mockReturnValue(true);
    storeHooks.useCanRedo.mockReturnValue(true);

    render(<Actions />);

    const undoBtn = screen.getByRole('button', { name: /undo/i });
    const redoBtn = screen.getByRole('button', { name: /redo/i });

    await user.click(undoBtn);

    expect(mockUndo).toHaveBeenCalledTimes(1);

    await user.click(redoBtn);

    expect(mockRedo).toHaveBeenCalledTimes(1);
  });

  it('should toggle Undo/Redo disabled state based on history availability', () => {
    const { rerender } = render(<Actions />);

    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled();

    // Update mocks to simulate available history
    storeHooks.useCanUndo.mockReturnValue(true);
    rerender(<Actions />);

    expect(screen.getByRole('button', { name: /undo/i })).not.toBeDisabled();
  });
});
