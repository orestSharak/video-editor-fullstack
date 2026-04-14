import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Clip } from './Clip';
import * as storeHooks from '@/store';

vi.mock('@/store', () => ({
  useSelectedClipId: vi.fn(),
  useSetSelectedClipId: vi.fn(),
}));

vi.mock('@/constants', () => ({
  MAX_TIMELINE_DURATION: 100,
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

vi.mock('@/constants', () => ({
  MAX_TIMELINE_DURATION: 100,
}));

const getClipElement = () => {
  const elements = screen.getAllByText('Test Clip');
  return elements.find((el) => el.closest('div[tabindex="0"]')).closest('div[tabindex="0"]');
};

describe('Clip', () => {
  const mockSetSelected = vi.fn();
  const defaultProps = {
    id: 'clip-1',
    name: 'Test Clip',
    startTime: 10,
    duration: 20,
    track: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    storeHooks.useSetSelectedClipId.mockReturnValue(mockSetSelected);
    storeHooks.useSelectedClipId.mockReturnValue(null);
  });

  it('should render the clip with correct name', () => {
    render(<Clip {...defaultProps} />);
    const clipTitle = screen.getAllByText('Test Clip')[0];

    expect(clipTitle).toBeInTheDocument();
  });

  it('should calculate correct positioning styles', () => {
    render(<Clip {...defaultProps} />);
    const clipElement = getClipElement();
    const style = clipElement.getAttribute('style');

    expect(style).toContain('left: 10%');
    expect(style).toContain('width: 20%');
    expect(style).toContain('top: 8px');
  });

  it('should apply active classes when selected', () => {
    storeHooks.useSelectedClipId.mockReturnValue('clip-1');
    render(<Clip {...defaultProps} />);

    const clipElement = getClipElement();
    // Change border and background
    expect(clipElement).toHaveClass('ring-2');
    expect(clipElement).toHaveClass('bg-primary/40');
  });

  it('should call setSelectedClipId on click', async () => {
    const user = userEvent.setup();
    render(<Clip {...defaultProps} />);

    await user.click(getClipElement());
    expect(mockSetSelected).toHaveBeenCalledWith('clip-1');
  });

  it('should allow selection via keyboard (Enter and Space)', async () => {
    const user = userEvent.setup();
    render(<Clip {...defaultProps} />);

    const clipElement = getClipElement();
    clipElement.focus();

    await user.keyboard('{Enter}');
    expect(mockSetSelected).toHaveBeenCalledWith('clip-1');

    vi.clearAllMocks();
    await user.keyboard(' ');
    expect(mockSetSelected).toHaveBeenCalledWith('clip-1');
  });

  it('should render on the correct vertical track', () => {
    render(<Clip {...defaultProps} track={2} />);
    const clipElement = getClipElement();

    // (2 * 52) + 8 = 112px
    expect(clipElement.getAttribute('style')).toContain('top: 112px');
  });
});
