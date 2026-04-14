import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';
import * as storeHooks from '@/store';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/store', () => ({
  useClips: vi.fn(),
  useSaveProject: vi.fn(),
  useDeleteProject: vi.fn(),
  useStatus: vi.fn(),
}));

describe('Header', () => {
  const mockSaveProject = vi.fn();
  const mockDeleteProject = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    storeHooks.useClips.mockReturnValue([{ id: '1' }]);
    storeHooks.useSaveProject.mockReturnValue(mockSaveProject);
    storeHooks.useDeleteProject.mockReturnValue(mockDeleteProject);
    storeHooks.useStatus.mockReturnValue('idle');

    // window.confirm mocking
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
  });

  it('should render header name', () => {
    render(<Header />);

    expect(screen.getByText('VideoEditor')).toBeDefined();
  });

  it('should render save and delete buttons', () => {
    render(<Header />);

    expect(screen.getByRole('button', { name: /save/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /delete/i })).toBeDefined();
  });

  it('should run saveProject action on user click on `save` button', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.click(saveButton);

    expect(mockSaveProject).toHaveBeenCalledTimes(1);
  });

  it('should render `Saving...` when status saving', () => {
    storeHooks.useStatus.mockReturnValue('saving');
    render(<Header />);

    expect(screen.getByText(/saving\.\.\./i)).toBeDefined();
  });

  it('should render disabled save button when status is saving', () => {
    storeHooks.useStatus.mockReturnValue('saving');
    render(<Header />);

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('should run deleteProject when user confirm by using window.confirm', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });

    await user.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure want to delete this project?');
    expect(mockDeleteProject).toHaveBeenCalledTimes(1);
  });

  it('should not run deleteProject when user reject confirm', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'confirm',
      vi.fn(() => false),
    );

    render(<Header />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });

    await user.click(deleteButton);

    expect(mockDeleteProject).not.toHaveBeenCalled();
  });
});
