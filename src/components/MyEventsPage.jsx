import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const MyEventsPage = ({ userEvents = [] }) => {
  const [jsonEvents, setJsonEvents] = useState([]);

  useEffect(() => {
    fetch('/events.json')
      .then((res) => res.json())
      .then((data) => setJsonEvents(data))
      .catch((err) => console.error('Failed to load events:', err));
  }, []);

  const allEvents = [...jsonEvents, ...userEvents];
  const today = dayjs();

  const upcomingEvents = allEvents.filter((e) => dayjs(e.date).isAfter(today, 'day'));
  const completedEvents = allEvents.filter((e) =>
    dayjs(e.date).isSame(today, 'day') || dayjs(e.date).isBefore(today, 'day')
  );

  const getEventType = (event) => {
    if (event.type === 'yearly') return '📆 Yearly';
    if (event.type === 'monthly') return '🗓️ Monthly';
    if (event.type === 'weekly') return '📅 Weekly';
    return '🔖 One-time';
  };

  const renderTable = (list, title) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2 text-purple-700">{title}</h2>
      {list.length === 0 ? (
        <p className="text-gray-500 italic">No events</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-purple-100 text-purple-700">
              <tr>
                <th className="px-4 py-2 text-left">📅 Date</th>
                <th className="px-4 py-2 text-left">📝 Title</th>
                <th className="px-4 py-2 text-left">⏰ Time</th>
                <th className="px-4 py-2 text-left">⌛ Duration</th>
                <th className="px-4 py-2 text-left">📂 Type</th>
                <th className="px-4 py-2 text-left">✅ Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((event, idx) => (
                <tr key={idx} className="hover:bg-purple-50 border-t">
                  <td className="px-4 py-2">{event.date}</td>
                  <td className="px-4 py-2">{event.title}</td>
                  <td className="px-4 py-2">{event.time}</td>
                  <td className="px-4 py-2">{event.duration || '-'}</td>
                  <td className="px-4 py-2">{getEventType(event)}</td>
                  <td className="px-4 py-2">
                    {dayjs(event.date).isAfter(today, 'day') ? 'Upcoming' : 'Completed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-purple-600">📋 My Events</h1>
      {renderTable(upcomingEvents, '🟢 Upcoming Events')}
      {renderTable(completedEvents, '🔵 Completed Events')}
    </div>
  );
};

export default MyEventsPage;
