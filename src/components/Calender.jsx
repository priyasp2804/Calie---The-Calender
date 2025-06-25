import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';

const Calendar = ({
  goToTodaySignal,
  resetToTodayMonthSignal,
  favouriteDates = [],
  onToggleFavourite,
  shouldScrollToToday,
  calendarView = 'month',
  userEvents = [],
  pinnedEvents = [],
  onPinEvent,
  onUnpinEvent,
  focusDate = null,
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [expandedCell, setExpandedCell] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const todayRef = useRef(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    setCurrentDate(dayjs());
  }, [resetToTodayMonthSignal]);

  useEffect(() => {
    setCurrentDate(dayjs());
    if (shouldScrollToToday) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }, 100);
    }
  }, [goToTodaySignal]);

  useEffect(() => {
    fetch('/events.json')
      .then((res) => res.json())
      .then(setEvents)
      .catch((err) => console.error('Failed to load events:', err));
  }, []);

  useEffect(() => {
    if (!focusDate) return;
    const target = dayjs(focusDate);
    setCurrentDate(target);
    setTimeout(() => {
      const el = document.querySelector(`[data-date='${target.format('YYYY-MM-DD')}']`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        el.classList.add('ring', 'ring-pink-400', 'ring-offset-2');
        setTimeout(() => el.classList.remove('ring', 'ring-pink-400', 'ring-offset-2'), 2000);
      }
    }, 200);
  }, [focusDate]);

  const getEventsForDate = (date) => {
    const allEvents = [...events, ...userEvents];
    const dateStr = date.format('YYYY-MM-DD');

    const uniqueEvents = allEvents.filter((event) => {
      const eventDate = dayjs(event.date);

      if (event.type === 'yearly') {
        return (
          eventDate.format('YYYY-MM-DD') === dateStr ||
          (eventDate.date() === date.date() && eventDate.month() === date.month() && eventDate.format('YYYY-MM-DD') !== dateStr)
        );
      } else if (event.type === 'monthly') {
        return (
          eventDate.format('YYYY-MM-DD') === dateStr ||
          (eventDate.date() === date.date() && eventDate.format('YYYY-MM-DD') !== dateStr)
        );
      } else if (event.type === 'weekly') {
        return (
          eventDate.format('YYYY-MM-DD') === dateStr ||
          (eventDate.day() === date.day() && eventDate.format('YYYY-MM-DD') !== dateStr)
        );
      } else {
        return eventDate.isSame(date, 'day');
      }
    });

    const seen = new Set();
    return uniqueEvents.filter((e) => {
      const key = `${e.title}-${e.time}-${e.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const groupEventsByTime = (events) => {
    return events.reduce((acc, event) => {
      if (!acc[event.time]) acc[event.time] = [];
      acc[event.time].push(event);
      return acc;
    }, {});
  };

  const goToPrevious = () => {
    setCurrentDate((prev) => prev.subtract(1, calendarView === 'month' ? 'month' : 'day'));
  };

  const goToNext = () => {
    setCurrentDate((prev) => prev.add(1, calendarView === 'month' ? 'month' : 'day'));
  };

  const handleEventClick = (event) => {
    setEditingEvent(event);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('Edited Event:', editingEvent);
    setEditingEvent(null);
  };

  const handleDelete = () => {
    console.log('Delete Event:', editingEvent);
    setEditingEvent(null);
  };

  const updateField = (field, value) => {
    setEditingEvent((prev) => ({ ...prev, [field]: value }));
  };

  let dates = [];
  if (calendarView === 'month') {
    const startOfMonth = currentDate.startOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();
    dates = [
      ...Array(startDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, d) => dayjs(currentDate).date(d + 1)),
    ];
  } else if (calendarView === 'week') {
    const startOfWeek = currentDate.startOf('week');
    dates = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
  } else {
    dates = [currentDate];
  }

  return (
    <section className="max-w-5xl mx-auto p-6 bg-white/60 rounded-2xl shadow-xl backdrop-blur-sm border border-pink-100 overflow-auto max-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPrevious} className="text-pink-500 hover:text-pink-600 text-xl font-bold">◀</button>

        <div className="flex items-center gap-4 text-purple-600 text-xl sm:text-4xl font-bold">
          <div className="flex flex-col items-center">
            <span className="text-sm sm:text-base font-semibold">Month</span>
            <select
              value={currentDate.month()}
              onChange={(e) => setCurrentDate(currentDate.set('month', parseInt(e.target.value)))}
              className="mt-1 px-2 py-1 rounded bg-white text-base border border-pink-300 shadow-sm"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>{dayjs().month(i).format('MMMM')}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm sm:text-base font-semibold">Year</span>
            <select
              value={currentDate.year()}
              onChange={(e) => setCurrentDate(currentDate.set('year', parseInt(e.target.value)))}
              className="mt-1 px-2 py-1 rounded bg-white text-base border border-pink-300 shadow-sm"
            >
              {Array.from({ length: 201 }, (_, i) => 1900 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={goToNext} className="text-pink-500 hover:text-pink-600 text-xl font-bold">▶</button>
      </div>

      {calendarView !== 'day' && (
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-semibold text-blue-500">
          {daysOfWeek.map((d, i) => (
            <div key={i} className={`py-2 rounded ${i === 0 || i === 6 ? 'bg-pink-100 text-red-600' : ''}`}>{d}</div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 gap-2 auto-rows-fr">
        {dates.map((date, idx) => {
          if (!date) return <div key={idx} className="bg-transparent" />;
          const dateStr = date.format('YYYY-MM-DD');
          const grouped = groupEventsByTime(getEventsForDate(date));
          const isExpanded = expandedCell === dateStr;
          const isToday = date.isSame(dayjs(), 'day');

          return (
            <div key={idx} className="contents">
              <div
                data-date={dateStr}
                ref={isToday ? todayRef : null}
                onClick={() => setExpandedCell(isExpanded ? null : dateStr)}
                className={`cursor-pointer p-2 rounded-lg flex flex-col items-start text-sm bg-white shadow-sm hover:shadow-md transition-all
                  ${isExpanded ? 'col-span-7' : ''}
                  ${isToday ? 'border-2 border-pink-400' : ''}`}
                style={{ gridColumn: isExpanded ? '1 / -1' : undefined }}
              >
                <span className="font-semibold mb-1 flex items-center justify-between w-full">
                  {date.date()}
                  <div className="ml-auto flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleFavourite(dateStr)}
                      className="hover:scale-110 transition"
                      title="Toggle Favourite"
                    >
                      {favouriteDates.includes(dateStr) ? '💗' : '♡'}
                    </button>
                    {pinnedEvents.some((p) => dayjs(p.date).isSame(date, 'day')) && (
                      <button
                        onClick={() =>
                          pinnedEvents
                            .filter((p) => dayjs(p.date).isSame(date, 'day'))
                            .forEach(onUnpinEvent)
                        }
                        title="Unpin all events"
                      >
                        📌
                      </button>
                    )}
                  </div>
                </span>
                <div className="flex flex-col gap-1 w-full max-h-[150px] overflow-y-auto">
                  {Object.entries(grouped).flatMap(([time, evts], i) =>
                    evts.map((event, j) => {
                      const isPinned = pinnedEvents.some(
                        (p) => p.title === event.title && p.date === event.date
                      );
                      const isConflict = evts.length > 1;
                      return (
                        <div
                          key={`${dateStr}-${i}-${j}`}
                          className={`px-1 py-0.5 rounded text-xs cursor-pointer truncate flex justify-between items-center
                            ${isConflict ? 'bg-yellow-100 text-yellow-600' : 'bg-pink-100 text-pink-700'}`}
                          title={`${isConflict ? '⚠️ Conflict • ' : ''}${event.title} at ${time}`}
                          draggable
                          onDragStart={() =>
                            isPinned ? onUnpinEvent?.(event) : onPinEvent?.(event)
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          <span className="truncate">{event.title}</span>
                          {isPinned && (
                              <button
                                title="Unpin"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUnpinEvent(event);
                                }}
                                className="ml-1 text-xs"
                              >
                                📌
                              </button>
                            )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {editingEvent && (
        <form
          onSubmit={handleEditSubmit}
          className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white border border-pink-300 rounded-lg shadow-lg p-6 w-full max-w-md z-50"
        >
          <h2 className="text-lg font-bold text-purple-600 mb-4">Edit Event</h2>

          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" value={editingEvent.title} onChange={(e) => updateField('title', e.target.value)} className="w-full mb-3 px-2 py-1 border rounded" />

          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={editingEvent.date} onChange={(e) => updateField('date', e.target.value)} className="w-full mb-3 px-2 py-1 border rounded" />

          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <input type="time" value={editingEvent.time} onChange={(e) => updateField('time', e.target.value)} className="w-full mb-3 px-2 py-1 border rounded" />

          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input type="text" value={editingEvent.duration || ''} onChange={(e) => updateField('duration', e.target.value)} className="w-full mb-3 px-2 py-1 border rounded" />

          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
          <select value={editingEvent.type || 'yearly'} onChange={(e) => updateField('type', e.target.value)} className="w-full mb-4 px-2 py-1 border rounded">
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>

          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Save</button>
            <button type="button" onClick={handleDelete} className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500">Delete</button>
            <button type="button" onClick={() => setEditingEvent(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
};

export default Calendar;
