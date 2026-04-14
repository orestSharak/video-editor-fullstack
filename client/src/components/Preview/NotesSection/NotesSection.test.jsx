import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotesSection } from './NotesSection';
import * as storeHooks from '@/store';

vi.mock('@/store', () => ({
  useNotes: vi.fn(),
  useAddNote: vi.fn(),
  useFetchNotes: vi.fn(),
  useStatus: vi.fn(),
  useCurrentProjectId: vi.fn(),
}));

describe('NotesSection', () => {
  const mockAddNote = vi.fn();
  const mockFetchNotes = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    storeHooks.useNotes.mockReturnValue([]);
    storeHooks.useAddNote.mockReturnValue(mockAddNote);
    storeHooks.useFetchNotes.mockReturnValue(mockFetchNotes);
    storeHooks.useStatus.mockReturnValue('idle');
    storeHooks.useCurrentProjectId.mockReturnValue('project-123');
  });

  it('should fetch notes on mount if project ID is present', () => {
    render(<NotesSection />);

    expect(mockFetchNotes).toHaveBeenCalledTimes(1);
  });

  it('should render `No notes yet` message when list is empty', () => {
    render(<NotesSection />);

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it('should render a list of notes', () => {
    storeHooks.useNotes.mockReturnValue([
      { id: '1', text: 'First note' },
      { id: '2', text: 'Second note' },
    ]);

    render(<NotesSection />);

    expect(screen.getByText('First note')).toBeInTheDocument();
    expect(screen.getByText('Second note')).toBeInTheDocument();
    expect(screen.queryByText(/no notes yet/i)).not.toBeInTheDocument();
  });

  it('should allow typing and submitting a new note', async () => {
    const user = userEvent.setup();
    render(<NotesSection />);

    const input = screen.getByPlaceholderText(/type a note/i);
    const button = screen.getByRole('button', { name: /add note/i });

    await user.type(input, 'New note');
    expect(input).toHaveValue('New note');

    await user.click(button);

    expect(mockAddNote).toHaveBeenCalledWith('New note');

    // Input clen up
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('should disable the button while saving or when input is empty', async () => {
    const { rerender } = render(<NotesSection />);
    const button = screen.getByRole('button', { name: /add note/i });

    expect(button).toBeDisabled();

    storeHooks.useStatus.mockReturnValue('saving');
    rerender(<NotesSection />);

    expect(screen.getByText(/adding\.\.\./i)).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
