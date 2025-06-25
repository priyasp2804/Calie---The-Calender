import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddEventPage = ({ onAddEvent }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    type: 'one-time' // default to one-time
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        <div>
          <label className="block font-medium text-gray-700 mb-1">Title</label>
          <input
            name="title"
            type="text"
            placeholder="Event title"
            required
            value={formData.title}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Date</label>
          <input
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Time</label>
          <input
            name="time"
            type="time"
            required
            value={formData.time}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Duration</label>
          <input
            name="duration"
            type="text"
            placeholder="e.g., 1h or 30m"
            value={formData.duration}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Event Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          >
            <option value="" disabled>Select Event Type</option>
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="one-time">One-time</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mt-2"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEventPage;
