import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchInput from '@/components/SearchInput';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('SearchInput', () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('renders with default placeholder', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchInput placeholder="Search projects..." />);
    const input = screen.getByPlaceholderText('Search projects...');
    expect(input).toBeInTheDocument();
  });

  it('initializes value from URL search params', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('q=test'));
    render(<SearchInput />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test');
  });

  it('updates input value on change', () => {
    render(<SearchInput />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'yarn' } });
    expect(input.value).toBe('yarn');
  });

  it('debounces the URL update', async () => {
    jest.useFakeTimers();
    render(<SearchInput />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'fabric' } });

    // Expect no immediate call
    expect(mockPush).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(300);

    expect(mockPush).toHaveBeenCalledWith('?q=fabric');
    jest.useRealTimers();
  });

  it('clears query param when input is empty', async () => {
    jest.useFakeTimers();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('q=initial'));
    
    render(<SearchInput />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '' } });
    
    jest.advanceTimersByTime(300);
    
    expect(mockPush).toHaveBeenCalledWith('?');
    jest.useRealTimers();
  });

  it('does not push if query matches existing param', async () => {
    jest.useFakeTimers();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('q=same'));
    
    render(<SearchInput />);
    const input = screen.getByRole('textbox');
    
    // Type the same thing
    fireEvent.change(input, { target: { value: 'same' } });
    
    jest.advanceTimersByTime(300);
    
    expect(mockPush).not.toHaveBeenCalled();
    jest.useRealTimers();
  });
});
