import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = ({
  onTodayClick,
  onShowFavourites,
  onLogoClick,
  isSidebarOpen,
  onSearch,
  searchQuery
}) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  const handleSearchInput = (value) => {
    setSearchTerm(value);
    onSearch(value); // 🔁 debounced in App.js only!
  };

  useEffect(() => {
    setSearchTerm(searchQuery || '');
  }, [searchQuery]);

  const exportAsPDF = () => window.print();

const SearchInput = () => (
    <div className="relative">
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => handleSearchInput(e.target.value)}
        className="pl-3 pr-14 py-1 text-sm border rounded focus:outline-none focus:ring focus:border-purple-300 w-full"
      />
      {searchTerm && (
        <div className="absolute right-2 top-1.5 flex items-center gap-1">
          <button onClick={() => handleSearchInput('')} className="text-gray-400 hover:text-red-500 text-xs" title="Clear">
            ❌
          </button>
          <button className="text-gray-500 hover:text-purple-600 text-sm" title="Search">
            🔍
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 shadow-md bg-pink-50 border-b border-purple-200 transition-all duration-300 ${
          isSidebarOpen ? 'pl-66' : ''
        }`}
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={onLogoClick}>
          <img src={logo} alt="Calie Logo" className="h-15 w-40 transition-transform hover:scale-105" />
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={onTodayClick}
            className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded hover:bg-purple-200 transition"
          >
            Today
          </button>

          <SearchInput />

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
            <button onClick={onTodayClick} className="w-full text-left px-3 py-2 bg-purple-100 text-purple-700 text-sm rounded hover:bg-purple-200 transition">
              Today
            </button>
            <SearchInput />
            <button onClick={onShowFavourites} className="w-full text-left px-3 py-2 text-lg rounded hover:bg-purple-100 transition">
              💙 Favourite Dates
            </button>
            <button onClick={exportAsPDF} className="w-full text-left px-3 py-2 text-lg rounded hover:bg-purple-100 transition">
              📤 Export
            </button>
            <button onClick={() => setShowHelp(true)} className="w-full text-left px-3 py-2 text-lg rounded hover:bg-purple-100 transition">
              📘 How to Use
            </button>
          </div>
        )}
      </header>

      {showHelp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-left">
            <h2 className="text-xl font-bold mb-4 text-purple-600">📘 How to Use Calie</h2>
            <ul className="text-sm list-disc ml-5 space-y-2 text-gray-700">
              <li>Click <strong>Calie</strong> logo to navigate to the home page.</li>
              <li>Use the <strong>Today</strong> button to jump to today’s date.</li>
              <li>Click any 💗 icon to mark dates as favourites.</li>
              <li>Click 💙 to see all your favourite dates.</li>
              <li>Switch between Month, Week, and Day views.</li>
              <li>Use the sidebar to <strong>Add Events</strong>.</li>
              <li>Check <strong>My Events</strong> to track upcoming/completed ones.</li>
              <li>Export your calendar using 📤.</li>
              <li><strong>Pin an Event:</strong> Drag it into the sidebar for 📌 pinned events.</li>
              <li><strong>Unpin:</strong> Click 📌 on a date to remove pinned events.</li>
              <li>🔍 <strong>Search:</strong> Find events by title or date.</li>
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
