import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimelineSlider } from './TimelineSlider';
import * as storeHooks from '@/store';

vi.mock('@/store', () => ({
  usePlayHeadPosition: vi.fn(),
  useSetPlayHeadPosition: vi.fn(),
}));

vi.mock('@/constants', () => ({
  MAX_TIMELINE_DURATION: 100,
}));

vi.mock('@/components', () => ({
  Slider: ({ value, max, onValueChange, className }) => (
    <input
      type="range"
      data-testid="timeline-slider"
      value={value[0]}
      max={max}
      className={className}
      onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
    />
  ),
}));

describe('TimelineSlider', () => {
  const mockSetPlayHeadPosition = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    storeHooks.useSetPlayHeadPosition.mockReturnValue(mockSetPlayHeadPosition);
    storeHooks.usePlayHeadPosition.mockReturnValue(25);
  });

  it('should render the slider with the correct current position', () => {
    render(<TimelineSlider />);

    const slider = screen.getByTestId('timeline-slider');
    expect(slider.value).toBe('25');
    expect(slider.getAttribute('max')).toBe('100');
  });

  it('should call setPlayHeadPosition when the slider value changes', async () => {
    render(<TimelineSlider />);

    const slider = screen.getByTestId('timeline-slider');
    // use fireEvent in purpose because useEvent is not handle it
    // official doc thread: https://github.com/testing-library/user-event/issues/871
    fireEvent.change(slider, { target: { value: '75' } });

    expect(mockSetPlayHeadPosition).toHaveBeenCalledWith(75);
    expect(mockSetPlayHeadPosition).toHaveBeenCalledTimes(1);
  });
});
