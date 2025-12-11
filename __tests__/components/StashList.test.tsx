import { render, screen, waitFor } from '@testing-library/react';
import StashList from '@/components/StashList';
import { useSearchParams } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock SearchInput since we already tested it and it complicates this test
jest.mock('../../components/SearchInput', () => {
  return function MockSearchInput({ placeholder }: { placeholder: string }) {
    return <input data-testid="search-input" placeholder={placeholder} />;
  };
});

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('StashList', () => {
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('renders loading state initially', () => {
    // Return a promise that never resolves to simulate loading
    mockFetch.mockImplementation(() => new Promise(() => {}));
    
    render(<StashList />);
    expect(screen.getByText('Loading stash...')).toBeInTheDocument();
  });

  it('renders stash items after fetch', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: '1',
          name: 'Blue Yarn',
          description: 'Cotton yarn',
          imageUrl: '/test.jpg',
          createdAt: new Date().toISOString(),
        },
      ],
    });

    render(<StashList />);

    await waitFor(() => {
      expect(screen.getByText('Blue Yarn')).toBeInTheDocument();
      expect(screen.getByText('Cotton yarn')).toBeInTheDocument();
    });
  });

  it('renders empty state when no items found', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<StashList />);

    await waitFor(() => {
      expect(screen.getByText('Your stash is empty')).toBeInTheDocument();
    });
  });

  it('fetches with query param', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('q=red'));
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<StashList />);

    await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/stash?q=red');
    });
  });
});
