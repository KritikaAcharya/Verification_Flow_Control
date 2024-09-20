import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App Component', () => {
  test('renders verification code input', () => {
    render(<App />);
    const headerElement = screen.getByText(/Enter 6-digit Verification Code/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders 6 input fields', () => {
    render(<App />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  test('allows only numeric input', () => {
    render(<App />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'a' } });
    expect(inputs[0]).toHaveValue('');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[0]).toHaveValue('1');
  });

  test('moves focus to next input after entering a digit', () => {
    render(<App />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(document.activeElement).toBe(inputs[1]);
  });

  test('highlights invalid inputs on submit', () => {
    render(<App />);
    const inputs = screen.getAllByRole('textbox');
    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);
    inputs.forEach(input => {
      expect(input).toHaveClass('invalid');
    });
  });

  test('removes highlight when input changes', () => {
    render(<App />);
    const inputs = screen.getAllByRole('textbox');
    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);
    expect(inputs[0]).toHaveClass('invalid');

    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[0]).not.toHaveClass('invalid');
  });

  test('shows error message for invalid input', () => {
    render(<App />);
    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);
    const errorMessage = screen.getByText('Please fill all inputs with valid numbers');
    expect(errorMessage).toBeInTheDocument();
  });

  test('submits form with valid input', async () => {
    axios.post.mockResolvedValue({ data: 'success' });
    delete window.location;
    window.location = { href: '' };

    render(<App />);
    const inputs = screen.getAllByRole('textbox');
    const submitButton = screen.getByText('Submit');

    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } });
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/verify', { code: '123456' });
      expect(window.location.href).toBe('/success');
    });
  });

  test('shows error message on failed verification', async () => {
    axios.post.mockRejectedValue(new Error('Verification failed'));

    render(<App />);
    const inputs = screen.getAllByRole('textbox');
    const submitButton = screen.getByText('Submit');

    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } });
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Verification Error');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});