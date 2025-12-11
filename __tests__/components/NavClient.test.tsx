import { render, screen } from '@testing-library/react'
import NavClient from '@/components/NavClient'

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

describe('NavClient', () => {
  it('renders sign in button when user is not logged in', () => {
    render(<NavClient />)
    
    // Check for "Sign in" button. There might be two (desktop and mobile)
    // getAllByText returns an array
    const signInButtons = screen.getAllByText('Sign in')
    expect(signInButtons.length).toBeGreaterThan(0)
    
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument()
  })

  it('renders user info and sign out button when logged in', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      id: '123',
    }

    render(<NavClient user={user} />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    
    const signOutButtons = screen.getAllByText('Sign out')
    expect(signOutButtons.length).toBeGreaterThan(0)
    
    // Projects link
    expect(screen.getByText('Projects')).toBeInTheDocument()
    // Stash link
    expect(screen.getByText('Stash')).toBeInTheDocument()
  })
})
