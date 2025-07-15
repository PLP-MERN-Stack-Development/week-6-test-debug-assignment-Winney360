import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from './Button';

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await axios.get(`/api/bugs?status=${statusFilter}`);
        console.log('API response:', response.data);
        setBugs(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Fetch bugs error:', err);
        setError('Failed to load bugs');
        setBugs([]);
      }
    };
    fetchBugs();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/bugs/${id}`);
      setBugs(bugs.filter((bug) => bug._id !== id));
    } catch (err) {
      setError('Failed to delete bug');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bug List</h2>
      <div className="mb-4">
        <label className="mr-2">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <Link to="/create" className="ml-4">
          <Button variant="primary">Report New Bug</Button>
        </Link>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {bugs.length === 0 && !error && <p>No bugs found.</p>}
      {Array.isArray(bugs) && bugs.length > 0 && (
        <div className="grid gap-4">
          {bugs.map((bug) => (
            <div key={bug._id} className="p-4 border rounded">
              <h3 className="text-xl font-semibold">{bug.title}</h3>
              <p>{bug.description}</p>
              <p>Priority: {bug.priority}</p>
              <p>Status: {bug.status}</p>
              <p>Created by: {bug.createdBy}</p>
              <div className="mt-2">
                <Link to={`/edit/${bug._id}`}>
                  <Button variant="secondary" className="mr-2">Edit</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(bug._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;