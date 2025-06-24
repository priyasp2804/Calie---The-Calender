import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddEventPage = ({ onAddEvent }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(formData);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">➕ Add New Event</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
        <input name="title" type="text" placeholder="Title" required value={formData.title} onChange={handleChange} className="p-2 border rounded" />
        <input name="date" type="date" required value={formData.date} onChange={handleChange} className="p-2 border rounded" />
        <input name="time" type="time" required value={formData.time} onChange={handleChange} className="p-2 border rounded" />
        <input name="duration" type="text" placeholder="Duration" value={formData.duration} onChange={handleChange} className="p-2 border rounded" />
        <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded">
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEventPage;
