import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Calendar from './components/Calender';
import FavouritesPage from './components/FavouritesPage';
import Sidebar from './components/Sidebar';
import MyEventsPage from './components/MyEventsPage';
import AddEventPage from './components/AddEventPage';

function App() {
  const [goToTodaySignal, setGoToTodaySignal] = useState(0);
  const [favouriteDates, setFavouriteDates] = useState([]);
  const [shouldScrollToToday, setShouldScrollToToday] = useState(false);
  const [resetToTodayMonthSignal, setResetToTodayMonthSignal] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('month');
  const [theme, setTheme] = useState('pink');
  const [jsonEvents, setJsonEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [focusDate, setFocusDate] = useState(null);
  const [pinnedEvents, setPinnedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('/events.json')
      .then((res) => res.json())
      .then((data) => setJsonEvents(data))
      .catch((err) => console.error('Failed to load events:', err));
  }, []);

  const handleTodayClick = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        setShouldScrollToToday(true);
        setGoToTodaySignal((prev) => prev + 1);
      }, 100); 
    } else {
      setShouldScrollToToday(true);
      setGoToTodaySignal((prev) => prev + 1);
    }
  };

  const handleLogoClick = () => {
    setResetToTodayMonthSignal((prev) => prev + 1);
    setShouldScrollToToday(false);
    navigate('/');
  };

  const handleToggleFavourite = (date) => {
    setFavouriteDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const handleRemoveFavourite = (date) => {
    setFavouriteDates((prev) => prev.filter((d) => d !== date));
  };

  const handleShowFavourites = () => {
    navigate('/favourites');
  };

  const handleAddEvent = (newEvent) => {
    setUserEvents((prev) => [...prev, newEvent]);
    setFocusDate(newEvent.date);
    navigate('/');
  };

  const handleDeleteEvent = (eventToDelete) => {
    setUserEvents((prev) =>
      prev.filter(
        (e) =>
          !(
            e.title === eventToDelete.title &&
            e.date === eventToDelete.date &&
            e.time === eventToDelete.time
          )
      )
    );
    setJsonEvents((prev) =>
      prev.filter(
        (e) =>
          !(
            e.title === eventToDelete.title &&
            e.date === eventToDelete.date &&
            e.time === eventToDelete.time
          )
      )
    );
  };

  const handlePinEvent = (event) => {
    setPinnedEvents((prev) => {
      const exists = prev.some(
        (e) => e.title === event.title && e.date === event.date
      );
      return exists ? prev : [...prev, event];
    });
  };

  const handleUnpinEvent = (eventToRemove) => {
    setPinnedEvents((prev) =>
      prev.filter(
        (e) =>
          !(e.title === eventToRemove.title && e.date === eventToRemove.date)
      )
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    const allEvents = [...jsonEvents, ...userEvents];
    const results = allEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.date.includes(query)
    );
    setSearchResults(results);
  };

  const handleSearchResultClick = (event) => {
    setFocusDate(event.date);
    setSearchResults([]);
    setSearchQuery('');
    navigate('/');
  };

  return (
    <div
      className={`min-h-screen flex text-gray-800 transition-all duration-300 ease-in-out ${
        theme === 'pink'
          ? 'bg-gradient-to-b from-pink-50 to-purple-50'
          : theme === 'blue'
          ? 'bg-gradient-to-b from-blue-50 to-cyan-100'
          : theme === 'mint'
          ? 'bg-gradient-to-b from-green-50 to-teal-100'
          : theme === 'lavender'
          ? 'bg-gradient-to-b from-violet-100 to-purple-200'
          : 'bg-gradient-to-b from-pink-50 to-purple-50'
      }`}
    >
      {isSidebarOpen && (
        <div className="w-64 shrink-0">
          <Sidebar
            onClose={() => setIsSidebarOpen(false)}
            calendarView={calendarView}
            onChangeView={setCalendarView}
            onChangeTheme={setTheme}
            currentTheme={theme}
            pinnedEvents={pinnedEvents}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col relative">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-6 left-6 bg-pink-400 hover:bg-pink-500 text-white rounded-full p-3 shadow-lg z-50"
            title="Open Menu"
          >
            📚
          </button>
        )}

        <Header
          onTodayClick={handleTodayClick}
          onShowFavourites={handleShowFavourites}
          onLogoClick={handleLogoClick}
          isSidebarOpen={isSidebarOpen}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />

        {searchResults.length > 0 && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-40 bg-white border border-purple-200 rounded shadow-md w-[90%] max-w-xl p-4">
            <h3 className="font-bold text-purple-600 mb-2 text-left">🔍 Search Results:</h3>
            <ul className="space-y-2 text-left text-sm max-h-64 overflow-y-auto">
              {searchResults.map((event, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-purple-50 cursor-pointer rounded flex justify-between items-center"
                  onClick={() => handleSearchResultClick(event)}
                >
                  <span>
                    📅 {event.date} — <strong>{event.title}</strong>
                  </span>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <main className="pt-[9rem] sm:pt-24 p-6 text-center">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <p className="text-lg text-purple-500 font-medium text-center mb-6 animate-fade-in">
                    Welcome to Calie — your personal calendar ✨
                  </p>
                  <Calendar
                    goToTodaySignal={goToTodaySignal}
                    resetToTodayMonthSignal={resetToTodayMonthSignal}
                    shouldScrollToToday={shouldScrollToToday}
                    favouriteDates={favouriteDates}
                    onToggleFavourite={handleToggleFavourite}
                    calendarView={calendarView}
                    jsonEvents={jsonEvents}
                    userEvents={userEvents}
                    focusDate={focusDate}
                    pinnedEvents={pinnedEvents}
                    onPinEvent={handlePinEvent}
                    onUnpinEvent={handleUnpinEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                </>
              }
            />
            <Route
              path="/favourites"
              element={
                <FavouritesPage
                  favouriteDates={favouriteDates}
                  onRemoveFavourite={handleRemoveFavourite}
                />
              }
            />
            <Route path="/myevents" element={<MyEventsPage userEvents={userEvents} jsonEvents={jsonEvents} />} />
            <Route path="/add-event" element={<AddEventPage onAddEvent={handleAddEvent} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
