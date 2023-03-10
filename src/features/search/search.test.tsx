import userEvent from '@testing-library/user-event'
import { render, screen, waitForElementToBeRemoved } from '../../test-renders'
import App from '../../App'

test('should search by github user', async () => {
  render(<App />)

  expect(screen.getByText(/nenhuma busca ainda/i)).toBeInTheDocument()

  const input = screen.getByPlaceholderText(/procure por um usuário do github/i)
  expect(input).toBeInTheDocument()

  userEvent.type(input, 'octocat')
  expect(input).toHaveValue('octocat')

  userEvent.click(screen.getByText(/buscar/i))

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/nenhuma busca ainda/i)
  )

  const cardUser = await screen.findByText(/the octocat/i)
  const cardRepository = await screen.findByText(/boysenberry-repo-1/)

  expect(cardUser).toBeInTheDocument()
  expect(cardRepository).toBeInTheDocument()

  // @ts-expect-error setSelectionRange has no types in html elements
  input.setSelectionRange(0, 7)

  userEvent.type(input, '{backspace}nouser')
  userEvent.click(screen.getByText(/buscar/i))

  const notFound = await screen.findByText(/nenhum usuário encontrado/i)

  expect(notFound).toBeInTheDocument()
  expect(cardUser).not.toBeInTheDocument()
  expect(cardRepository).not.toBeInTheDocument()
})
