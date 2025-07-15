import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugForm from '../../components/BugForm';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('BugForm Component', () => {
  it('renders create bug form', () => {
    render(
      <BrowserRouter>
        <BugForm />
      </BrowserRouter>
    );

    expect(screen.getByText('Report New Bug')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Submit Bug')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    axios.post.mockResolvedValue({ data: {} });

    render(
      <BrowserRouter>
        <BugForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Bug' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'high' } });
    fireEvent.click(screen.getByText('Submit Bug'));

    expect(axios.post).toHaveBeenCalledWith(
      '/api/bugs',
      {
        title: 'Test Bug',
        description: 'Test description',
        priority: 'high',
        status: 'open',
      },
      expect.any(Object)
    );
  });

  it('displays error message on submission failure', async () => {
    axios.post.mockRejectedValue({ message: 'Failed to save bug' });

    render(
      <BrowserRouter>
        <BugForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Bug' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });
    fireEvent.click(screen.getByText('Submit Bug'));

    expect(await screen.findByText('Failed to save bug')).toBeInTheDocument();
  });
});