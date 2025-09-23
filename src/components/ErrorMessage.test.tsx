import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { ErrorMessage } from './ErrorMessage';

test('ErrorMessage should render correctly', () => {
  render(<ErrorMessage message="Test error" />);
  expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
  expect(screen.getByText('Test error')).toBeInTheDocument();
});

test('ErrorMessage should show and call retry button', () => {
  const onRetry = vi.fn();
  render(<ErrorMessage message="Test error" onRetry={onRetry} />);
  const retryButton = screen.getByText('Tentar novamente');
  expect(retryButton).toBeInTheDocument();
  fireEvent.click(retryButton);
  expect(onRetry).toHaveBeenCalledTimes(1);
});
