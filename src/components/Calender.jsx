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
  focusDate = null,
  pinnedEvents = [],
  onPinEvent,
  onUnpinEvent,
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [expandedCell, setExpandedCell] = useState(null);
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

  const groupEventsByTime = (eventList) => {
    return eventList.reduce((acc, event) => {
      if (!acc[event.time]) acc[event.time] = [];
      acc[event.time].push(event);
      return acc;
    }, {});
  };

  const getEventsForDate = (date) =>
    [...events, ...userEvents].filter((event) => dayjs(event.date).isSame(date, 'day'));

  const goToPrevious = () => {
    setCurrentDate((prev) => prev.subtract(1, calendarView === 'month' ? 'month' : 'day'));
  };

  const goToNext = () => {
    setCurrentDate((prev) => prev.add(1, calendarView === 'month' ? 'month' : 'day'));
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
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPrevious} className="text-pink-500 hover:text-pink-600 text-xl font-bold transition-transform hover:scale-110">
          ◀
        </button>
        <div className="flex items-center gap-2 text-purple-600 text-xl sm:text-4xl font-bold">
          <span className="relative">
            {currentDate.format('MMMM')}
            <select
              value={currentDate.month()}
              onChange={(e) => setCurrentDate(currentDate.month(parseInt(e.target.value)))}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Change Month"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>{dayjs().month(i).format('MMMM')}</option>
              ))}
            </select>
          </span>

          <span className="text-xs mt-1">🔽</span>

          <span className="relative">
            {currentDate.format('YYYY')}
            <select
              value={currentDate.year()}
              onChange={(e) => setCurrentDate(currentDate.year(parseInt(e.target.value)))}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Change Year"
            >
              {Array.from({ length: 201 }, (_, i) => 1900 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </span>

          <span className="text-xs mt-1">🔽</span>
        </div>

        <button onClick={goToNext} className="text-pink-500 hover:text-pink-600 text-xl font-bold transition-transform hover:scale-110">
          ▶
        </button>
      </div>

      {/* Weekdays */}
      {calendarView !== 'day' && (
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-semibold text-blue-500">
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className={`py-2 rounded ${index === 0 || index === 6 ? 'bg-pink-100 text-red-600' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Dates Grid */}
      <div className="grid grid-cols-7 gap-2 auto-rows-fr">
        {dates.map((date, idx) => {
          if (!date) return <div key={idx} className="bg-transparent" />;

          const isToday = date.isSame(dayjs(), 'day');
          const dateStr = date.format('YYYY-MM-DD');
          const grouped = groupEventsByTime(getEventsForDate(date));
          const isExpanded = expandedCell === dateStr;

          return (
            <div key={idx} className="contents">
              <div
                data-date={dateStr}
                ref={isToday ? todayRef : null}
                onClick={() => setExpandedCell(isExpanded ? null : dateStr)}
                className={`cursor-pointer p-2 rounded-lg flex flex-col items-start text-sm bg-white shadow-sm hover:shadow-md transition-all
                  ${isToday ? 'border-2 border-pink-400' : ''}
                  ${date.day() === 0 || date.day() === 6 ? 'text-red-500' : ''}
                  ${isExpanded ? 'col-span-7' : ''}`}
                style={{ gridColumn: isExpanded ? '1 / -1' : undefined }}
              >
                <span className="font-semibold mb-1 flex items-center justify-between w-full">
                  {date.date()}
                  <div
                    className="ml-auto flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavourite(dateStr);
                      }}
                      className="text-md hover:scale-110 transition"
                      title="Toggle Favourite"
                    >
                      {favouriteDates.includes(dateStr) ? '💗' : '♡'}
                    </button>
                    {pinnedEvents.some((p) => dayjs(p.date).isSame(date, 'day')) && (
                      <button
                        className="text-[12px]"
                        title="Unpin all events"
                        onClick={(e) => {
                          e.stopPropagation();
                          pinnedEvents
                            .filter((p) => dayjs(p.date).isSame(date, 'day'))
                            .forEach(onUnpinEvent);
                        }}
                      >
                        📌
                      </button>
                    )}
                  </div>
                </span>

                <div className={`flex flex-col gap-1 mt-1 w-full overflow-y-auto max-h-[160px]`}>
                  {Object.entries(grouped).flatMap(([time, evts], i) =>
                    evts.map((event, j) => {
                      const isPinned = pinnedEvents.some(
                        (p) => p.title === event.title && p.date === event.date
                      );
                      const isConflict = evts.length > 1;
                      return (
                        <div
                          key={`${i}-${j}`}
                          className={`text-[10px] px-1 py-0.5 rounded-md truncate cursor-pointer ${
                            isConflict ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-700'
                          }`}
                          title={`${isConflict ? '⚠️ Conflict • ' : ''}${event.title} at ${time}`}
                          draggable
                          onDragStart={() =>
                            isPinned ? onUnpinEvent(event) : onPinEvent(event)
                          }
                        >
                          {event.title}
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
    </section>
  );
};

export default Calendar;
