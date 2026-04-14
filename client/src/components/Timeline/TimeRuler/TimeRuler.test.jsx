import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TimeRuler } from './TimeRuler';

vi.mock('@/constants', () => ({
  MAX_TIMELINE_DURATION: 60,
}));

describe('TimeRuler', () => {
  it('should render the correct number of time steps', () => {
    render(<TimeRuler />);

    const timeMarkers = screen.getAllByText(/\d+s/);

    // 60s / 5s step = 13 markers
    expect(timeMarkers).toHaveLength(13);
    expect(screen.getByText('0s')).toBeInTheDocument();
    expect(screen.getByText('60s')).toBeInTheDocument();
  });
});
