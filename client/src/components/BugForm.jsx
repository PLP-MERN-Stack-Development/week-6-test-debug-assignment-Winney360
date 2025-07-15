import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from './Button';

const BugForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/api/bugs/${id}`)
        .then((response) => {
          setFormData(response.data);
        })
        .catch(() => setError('Failed to load bug'));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form:', formData);
    try {
      if (id) {
        await axios.put(`/api/bugs/${id}`, formData);
      } else {
        await axios.post('/api/bugs', { ...formData, createdBy: 'testuser' });
      }
      navigate('/');
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Failed to save bug');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Bug' : 'Report New Bug'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        {id && (
          <div>
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}
        <Button type="submit" variant={id ? 'secondary' : 'primary'}>
          {id ? 'Update Bug' : 'Submit Bug'}
        </Button>
      </form>
    </div>
  );
};

export default BugForm;