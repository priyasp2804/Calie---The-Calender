import { useNavigate } from 'react-router-dom';

const Sidebar = ({
  onClose,
  calendarView,
  onChangeView,
  currentTheme,
  onChangeTheme,
  pinnedEvents = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 h-full bg-pink-100 shadow-xl w-full max-w-[16rem] z-60 transition-all duration-300">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-lg text-purple-700 hover:text-purple-900">❌</button>
      </div>

      <div className="flex flex-col gap-4 p-6 text-purple-800 h-[calc(100vh-64px)] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">🧭 Menu</h2>

        <div>
          <p className="text-sm font-semibold mb-1">📅 Calendar View</p>
          <div className="flex gap-2 mt-1">
            {['month', 'week', 'day'].map((mode) => (
              <button
                key={mode}
                onClick={() => onChangeView(mode)}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  calendarView === mode
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-purple-700 hover:bg-purple-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-1 mt-4">🎨 Themes</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {['pink', 'blue', 'mint', 'lavender'].map((color) => (
              <button
                key={color}
                onClick={() => onChangeTheme(color)}
                className={`px-3 py-1 text-sm rounded-full border transition ${
                  currentTheme === color
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-purple-700 hover:bg-purple-200'
                }`}
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            navigate('/myevents');
            onClose();
          }}
          className="hover:bg-purple-200 rounded px-3 py-2 text-left mt-1 bg-purple-100 font-semibold"
        >
          📝 My Events
        </button>

        <button
          onClick={() => {
            navigate('/add-event');
            onClose();
          }}
          className="hover:bg-purple-200 rounded px-3 py-2 text-left mt-1 bg-purple-100 font-semibold"
        >
          ➕ Add New Event
        </button>

        <div>
          <p className="text-sm font-semibold mb-1 mt-4">📌 Pinned Events</p>
          {pinnedEvents.length === 0 ? (
            <p className="text-xs italic text-gray-600">No pinned events</p>
          ) : (
            <ul className="text-sm pl-4 list-disc space-y-1">
              {pinnedEvents.map((event, idx) => (
                <li key={idx} title={`📅 ${event.date} @ ${event.time}`}>
                  {event.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 bg-white p-3 rounded shadow">
          <p className="text-sm italic">💡 Tip of the Day:</p>
          <p className="text-xs mt-1">“Plan your day. Don't let it plan you.”</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
