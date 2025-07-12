import { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const SearchInput = forwardRef(({ searchTerm, onSearch, onClear }, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-3 pr-14 py-1 text-sm border rounded focus:outline-none focus:ring focus:border-purple-300 w-full"
      />
      {searchTerm && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <button 
            onClick={onClear} 
            className="text-gray-400 hover:text-red-500 text-xs" 
            title="Clear"
            type="button"
          >
            ❌
          </button>
        </div>
      )}
    </div>
  );
});

const Header = ({
  onTodayClick,
  onShowFavourites,
  onLogoClick,
  isSidebarOpen,
  onSearch,
  searchTerm
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  const handleClearSearch = () => {
    onSearch('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const exportAsPDF = () => window.print();

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 shadow-md bg-pink-50 border-b border-purple-200 transition-all duration-300 ${
          isSidebarOpen ? 'pl-66' : ''
        }`}
      >
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 cursor-pointer"
          onClick={onLogoClick}
        >
          <img src={logo} alt="Calie Logo" className="h-15 w-40 transition-transform hover:scale-105" />
          <div className="text-sm sm:text-base text-purple-700 font-semibold leading-tight">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={onTodayClick}
            className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded hover:bg-purple-200 transition"
          >
            Today
          </button>

          <SearchInput 
            ref={searchInputRef}
            searchTerm={searchTerm}
            onSearch={onSearch}
            onClear={handleClearSearch}
          />

          <button
            onClick={() => navigate('/favourites')}
            className="text-lg px-2 py-1 rounded hover:bg-purple-100 transition"
            title="Favourite Dates"
          >
            💙
          </button>

          <button
            onClick={exportAsPDF}
            className="text-lg px-2 py-1 rounded hover:bg-purple-100 transition"
            title="Export as PDF"
          >
            📤
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="text-lg px-2 py-1 rounded hover:bg-purple-100 transition"
            title="How to Use"
          >
            📘
          </button>
        </div>

        <div className="sm:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-2xl px-2 py-1 rounded hover:bg-purple-100 transition"
          >
            ☰
          </button>
        </div>

        {showMobileMenu && (
          <div className="absolute top-20 right-4 bg-white shadow-lg border rounded p-4 z-50 w-64 flex flex-col gap-3 sm:hidden">
            <button
              onClick={() => {
                onTodayClick();
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-3 py-2 bg-purple-100 text-purple-700 text-sm rounded hover:bg-purple-200 transition"
            >
              Today
            </button>

          <SearchInput 
            ref={searchInputRef}
            searchTerm={searchTerm}
            onSearch={onSearch}
            onClear={handleClearSearch}
          />

            <button
              onClick={() => {
                onShowFavourites();
                setShowMobileMenu(false);
              }}
              className="w-full text-left text-lg px-3 py-2 rounded hover:bg-purple-100 transition"
            >
              💙 Favourite Dates
            </button>

            <button
              onClick={() => {
                exportAsPDF();
                setShowMobileMenu(false);
              }}
              className="w-full text-left text-lg px-3 py-2 rounded hover:bg-purple-100 transition"
            >
              📤 Export
            </button>

            <button
              onClick={() => {
                setShowHelp(true);
                setShowMobileMenu(false);
              }}
              className="w-full text-left text-lg px-3 py-1 rounded hover:bg-purple-100 transition"
            >
              📘 How to Use
            </button>
          </div>
        )}
      </header>

      {showHelp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-left max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-purple-600">📘 How to Use Calie</h2>
            <ul className="text-sm list-disc ml-5 space-y-2 text-gray-700">
              <li>Click the <strong>Calie</strong> logo to return to the home page.</li>
              <li>Use the <strong>Today</strong> button to instantly jump to today's date.</li>
              <li>Click the ♡ icon on any date to mark it as a <strong>favourite💗</strong>.</li>
              <li>Click 💙 in the header to view all your <strong>favourite dates</strong>.</li>
              <li>Switch between <strong>Month, Week, and Day</strong> views from the sidebar.</li>
              <li>Click on a date cell to <strong>expand it</strong> and view all events for that day.</li>
              <li><strong>Edit Event:</strong> Click any event to edit its details like title, time, or type.</li>
              <li><strong>Pin an Event:</strong> Drag any event to pin it. 📌 icon appears on that date.</li>
              <li><strong>Unpin:</strong> Click the 📌 icon on the date to remove all pinned events for that day.</li>
              <li><strong>Search 🔍</strong> by typing a title or date in the search bar to locate events quickly.</li>
              <li>Click the <strong>Export 📤</strong> button to download your calendar view.</li>
              <li>Conflicting events (same time on same day) are shown in <span className="text-yellow-600 font-semibold">yellow</span> for quick identification.</li>
            </ul>
            <p className="text-center text-2xl mt-4 font-semibold">
              Calie — your calendar for an Aesthetic, Light, Intuitive Experience ✨💫
            </p>
            <div className="text-right mt-6">
              <button
                onClick={() => setShowHelp(false)}
                className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;