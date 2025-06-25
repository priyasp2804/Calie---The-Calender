const FavouritesPage = ({ favouriteDates, onRemoveFavourite }) => {
  return (
    <div className="max-w-xl mx-auto mt-[3rem] sm:mt-0 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">💙 Favourite Dates</h2>

      {favouriteDates.length === 0 ? (
        <p className="text-gray-500">No favourites yet!</p>
      ) : (
        <ul className="space-y-2">
          {favouriteDates.map((date) => (
            <li
              key={date}
              className="flex items-center justify-between bg-purple-50 px-4 py-2 rounded shadow-sm"
            >
              <span className="text-sm sm:text-base">{date}</span>
              <button
                onClick={() => onRemoveFavourite(date)}
                className="text-red-500 hover:text-red-700 text-sm"
                title="Remove from Favourites"
              >
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavouritesPage;
