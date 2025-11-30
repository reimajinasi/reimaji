import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('menampilkan teks anak pada Button', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
})
