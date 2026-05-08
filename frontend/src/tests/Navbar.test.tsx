import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';

// Mock useAuth directly or mock the context value
vi.mock('../context/AuthContext', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

import { useAuth } from '../context/AuthContext';

describe('Navbar', () => {
  it('renders login and signup links when not authenticated', () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(<Navbar />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Join Free')).toBeInTheDocument();
  });

  it('renders user name and logout link when authenticated', () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'John Doe' },
      logout: vi.fn(),
    });

    render(<Navbar />);
    
    expect(screen.getByText('Hi, John Doe')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
