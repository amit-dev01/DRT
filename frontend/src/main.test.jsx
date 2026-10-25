import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from './main.jsx'

beforeEach(() => { window.scrollTo = vi.fn() })
afterEach(cleanup)

describe('rate-limit dashboard preview', () => {
  it('navigates from the overview to policy management', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Rate limits/ }))

    expect(screen.getByRole('heading', { name: 'Rate limit policies' })).toBeTruthy()
    expect(screen.getByText('Partner integrations')).toBeTruthy()
  })

  it('creates a policy in the local preview state', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Rate limits/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Create policy' }))

    const dialog = screen.getByRole('dialog')
    fireEvent.change(within(dialog).getByLabelText('Policy name'), { target: { value: 'Internal tools' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Create policy' }))

    expect(screen.getByText('Internal tools')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Rate limits.*6/ })).toBeTruthy()
  })

  it('simulates an over-limit response after a short request burst', () => {
    render(<App />)
    const testButton = screen.getByRole('button', { name: /Test request/ })

    for (let request = 0; request < 4; request += 1) fireEvent.click(testButton)

    expect(screen.getByText('Test request rate limited · HTTP 429')).toBeTruthy()
  })
})
