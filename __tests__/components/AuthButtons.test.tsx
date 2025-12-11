import { render, screen, fireEvent } from '@testing-library/react'
import { LoginButton, LogoutButton } from '@/components/AuthButtons'
import { signIn, signOut } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

describe('AuthButtons', () => {
  it('LoginButton calls signIn on click', () => {
    render(<LoginButton />)
    fireEvent.click(screen.getByText('Sign in'))
    expect(signIn).toHaveBeenCalled()
  })

  it('LogoutButton calls signOut on click', () => {
    render(<LogoutButton />)
    fireEvent.click(screen.getByText('Sign out'))
    expect(signOut).toHaveBeenCalled()
  })
})
