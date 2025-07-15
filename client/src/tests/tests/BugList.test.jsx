import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugList from '../../components/BugList';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('BugList Component', () => {
  it('renders bug list with data', async () => {
    const mockBugs = [
      {
        _id: '1',
        title: 'Test Bug',
        description: 'Test description',
        priority: 'medium',
        status: 'open',
        createdBy: { username: 'testuser' },
      },
    ];
    axios.get.mockResolvedValue({ data: mockBugs });

    render(
      <BrowserRouter>
        <BugList />
      </BrowserRouter>
    );

    expect(await screen.findByText('Test Bug')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Priority: medium')).toBeInTheDocument();
    expect(screen.getByText('Status: open')).toBeInTheDocument();
  });

  it('displays empty state', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <BugList />
      </BrowserRouter>
    );

    expect(await screen.findByText('No bugs found.')).toBeInTheDocument();
  });

  it('filters bugs by status', async () => {
    const mockBugs = [
      {
        _id: '1',
        title: 'Test Bug',
        description: 'Test description',
        priority: 'medium',
        status: 'open',
        createdBy: { username: 'testuser' },
      },
    ];
    axios.get.mockResolvedValue({ data: mockBugs });

    render(
      <BrowserRouter>
        <BugList />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Filter by status:'), { target: { value: 'open' } });

    expect(axios.get).toHaveBeenCalledWith('/api/bugs?status=open');
    expect(await screen.findByText('Test Bug')).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    axios.get.mockRejectedValue({ message: 'Failed to load bugs' });

    render(
      <BrowserRouter>
        <BugList />
      </BrowserRouter>
    );

    expect(await screen.findByText('Failed to load bugs')).toBeInTheDocument();
  });
});