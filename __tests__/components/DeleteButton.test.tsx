import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import DeleteButton from '@/components/DeleteButton';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock global.fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock window.alert
const mockAlert = jest.fn();
window.alert = mockAlert;

describe('DeleteButton', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    mockFetch.mockClear();
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockAlert.mockClear();
  });

  it('renders the delete button', () => {
    render(
      <DeleteButton id="1" endpoint="/api/projects" redirectUrl="/projects" itemName="project" />
    );
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('opens confirm dialog on click', async () => {
    render(
      <DeleteButton id="1" endpoint="/api/projects" redirectUrl="/projects" itemName="project" />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(await screen.findByText('Delete project')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this project?/i)).toBeInTheDocument();
  });

  it('closes confirm dialog when cancel is clicked', async () => {
    render(
      <DeleteButton id="1" endpoint="/api/projects" redirectUrl="/projects" itemName="project" />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(await screen.findByText('Delete project')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => expect(screen.queryByText('Delete project')).not.toBeInTheDocument());
  });

  it('calls fetch and redirects on successful delete', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    render(
      <DeleteButton id="1" endpoint="/api/projects" redirectUrl="/projects" itemName="project" />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /delete/i })); // Confirm delete button

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/projects/1', {
        method: 'DELETE',
      });
      expect(mockPush).toHaveBeenCalledWith('/projects');
      expect(mockRefresh).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Deleting...')).not.toBeInTheDocument();
    });
  });

  it('shows "Deleting..." status during fetch', async () => {
    mockFetch.mockReturnValueOnce(new Promise(() => {})); // Never resolve to keep it pending

    render(
      <DeleteButton id="1" endpoint="/api/projects" redirectUrl="/projects" itemName="project" />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /delete/i }));

    expect(screen.getByRole('button', { name: /deleting.../i })).toBeInTheDocument();
  });

  it('shows alert on failed delete (res.ok is false)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    render(
      <DeleteButton id="1" endpoint="/api/projects" redirectUrl="/projects" itemName="project" />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Failed to delete.');
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockRefresh).not.toHaveBeenCalled();
      expect(screen.queryByText('Deleting...')).not.toBeInTheDocument();
    });
  });

  it('shows alert on error during fetch', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <DeleteButton id="1" endpoint="/api/projects" redirectUrl="/projects" itemName="project" />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error deleting.');
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockRefresh).not.toHaveBeenCalled();
      expect(screen.queryByText('Deleting...')).not.toBeInTheDocument();
    });
  });
});
