import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

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