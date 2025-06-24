import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';

const Calendar = ({
  goToTodaySignal,
  resetToTodayMonthSignal,
  favouriteDates = [],
  onToggleFavourite,
  shouldScrollToToday,
  calendarView = 'month',
  userEvents = [],
  focusDate = null,
  pinnedEvents = [],
  onPinEvent,
  onUnpinEvent
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const todayRef = useRef(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    setCurrentDate(dayjs());
  }, [resetToTodayMonthSignal]);

  useEffect(() => {
    setCurrentDate(dayjs());
    if (shouldScrollToToday) {
      setTimeout(() => {
        if (todayRef.current) {
          todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }, 100);
    }
  }, [goToTodaySignal]);

  useEffect(() => {
    fetch('/events.json')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error('Failed to load events:', err));
  }, []);

  useEffect(() => {
    if (focusDate) {
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
    }
  }, [focusDate]);

  let dates = [];
  if (calendarView === 'month') {
    const startOfMonth = currentDate.startOf('month');
    const daysInMonth = currentDate.daysInMonth();
    const startDay = startOfMonth.day();

    for (let i = 0; i < startDay; i++) dates.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      dates.push(dayjs(currentDate).date(d));
    }
  } else if (calendarView === 'week') {
    const startOfWeek = currentDate.startOf('week');
    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.add(i, 'day'));
    }
  } else if (calendarView === 'day') {
    dates.push(currentDate);
  }

  const groupEventsByTime = (eventList) => {
    const grouped = {};
    for (const event of eventList) {
      if (!grouped[event.time]) grouped[event.time] = [];
      grouped[event.time].push(event);
    }
    return grouped;
  };

  const goToPrevious = () => {
    const amount = 1;
    const unit = calendarView === 'month' ? 'month' : 'day';
    setCurrentDate(currentDate.subtract(amount, unit));
  };

  const goToNext = () => {
    const amount = 1;
    const unit = calendarView === 'month' ? 'month' : 'day';
    setCurrentDate(currentDate.add(amount, unit));
  };

  const getHeaderTitle = () => {
    if (calendarView === 'month') return currentDate.format('MMMM YYYY');
    if (calendarView === 'week') {
      const start = currentDate.startOf('week');
      const end = currentDate.endOf('week');
      return `${start.format('DD MMM')} - ${end.format('DD MMM YYYY')}`;
    }
    return currentDate.format('dddd, MMMM D, YYYY');
  };

  const getEventsForDate = (date) => {
    return [...events, ...userEvents].filter((event) =>
      dayjs(event.date).isSame(date, 'day')
    );
  };

  return (
    <section className="max-w-5xl mx-auto p-6 bg-white/60 rounded-2xl shadow-xl backdrop-blur-sm border border-pink-100 overflow-auto max-h-[80vh]">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPrevious} className="text-pink-500 hover:text-pink-600 text-xl font-bold transition-transform hover:scale-110">◀</button>
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-600">{getHeaderTitle()}</h2>
        <button onClick={goToNext} className="text-pink-500 hover:text-pink-600 text-xl font-bold transition-transform hover:scale-110">▶</button>
      </div>

      {/* Weekdays */}
      {calendarView !== 'day' && (
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-semibold text-blue-500">
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className={`py-2 rounded ${
                index === 0
                  ? 'bg-pink-100 text-red-600'
                  : index === 6
                  ? 'bg-purple-100 text-red-600'
                  : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Date Grid */}
      <div className={`grid ${calendarView === 'day' ? 'grid-cols-1' : 'grid-cols-7'} gap-2`}>
        {dates.map((date, idx) => {
          const isToday = date?.isSame(dayjs(), 'day');
          const dateStr = date?.format('YYYY-MM-DD');

          if (!date) return <div key={idx} className="bg-transparent" />;

          return (
            <div
              key={idx}
              data-date={dateStr}
              ref={isToday ? todayRef : null}
              className={`min-h-[90px] p-2 rounded-lg transition-all flex flex-col items-start justify-start text-sm
                bg-white shadow-sm hover:shadow-md
                ${isToday ? 'border-2 border-pink-400' : ''}
                ${date.day() === 0 ? 'text-red-500' : ''}
                ${date.day() === 6 ? 'text-red-500' : ''}
              `}
            >
              <span className="font-semibold mb-1 flex items-center justify-between w-full">
                {date.date()}
                <div className="ml-auto flex items-center gap-1">
                  {/* 📌 Pin icon */}
                  {pinnedEvents.some((p) => dayjs(p.date).isSame(date, 'day')) && (
                    <button
                      className="text-[12px]"
                      title="Unpin all events for this date"
                      onClick={() => {
                        pinnedEvents
                          .filter((p) => dayjs(p.date).isSame(date, 'day'))
                          .forEach(onUnpinEvent);
                      }}
                    >
                      📌
                    </button>
                  )}
                  {/* 💗 Heart icon */}
                  <button
                    onClick={() => onToggleFavourite(dateStr)}
                    className="text-md hover:scale-110 transition"
                    title="Toggle Favourite"
                  >
                    {favouriteDates.includes(dateStr) ? '💗' : '♡'}
                  </button>
                </div>
              </span>

              {/* Events */}
              <div className="flex flex-col gap-1 mt-1 w-full">
                {(() => {
                  const grouped = groupEventsByTime(getEventsForDate(date));
                  return Object.entries(grouped).map(([time, evts], i) => {
                    const event = evts[0];
                    const isPinned = pinnedEvents.some(
                      (p) => p.title === event.title && p.date === event.date
                    );

                    return (
                      <div
                        key={i}
                        className={`text-[10px] px-1 py-0.5 rounded-md truncate cursor-pointer ${
                          evts.length > 1
                            ? 'bg-red-100 text-red-600'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                        title={`${
                          evts.length > 1 ? 'Conflict: ' : ''
                        }${evts.map((e) => e.title).join(', ')} at ${time}`}
                        draggable
                        onDragStart={() =>
                          isPinned ? onUnpinEvent(event) : onPinEvent(event)
                        }
                      >
                        {evts.length > 1 ? `⚠️ ${evts.length} events` : event.title}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Calendar;
