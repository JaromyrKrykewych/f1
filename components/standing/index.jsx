const Standing = ({ standings, cols }) => {
  return (
    <div className={`w-full max-w-md mx-auto`}>
      <h2 className="text-white text-xl font-bold mb-5">
        {`Ranking by points`}
      </h2>
      {/* Encabezado */}
      <div className="grid grid-cols-[15%_40%_15%_15%_15%] bg-gray-700 text-white font-bold py-3 px-4 rounded-t-2xl">
        <span>Pos.</span>
        <span>Driver</span>
        <span className="text-center">N° R.</span>
        <span className="text-center">Wins</span>
        <span className="text-center">Pts</span>
      </div>

      {/* Filas de pilotos */}
      <div className="flex flex-col">
        {standings.map((entry, index) => (
          <div
            key={index}
            className={`grid grid-cols-[15%_40%_15%_15%_15%] py-3 px-4 border-b border-gray-500 items-center
            ${
              index === 0
                ? "bg-yellow-500 text-gray-900 font-bold"
                : index === 1
                ? "bg-gray-400 text-gray-900 font-bold"
                : index === 2
                ? "bg-orange-500 text-gray-900 font-bold"
                : "bg-gradient-to-b from-gray-800 to-gray-600 text-white"
            }
            ${index === standings.length - 1 ? "rounded-b-2xl" : "rounded-none"}
            `}
          >
            <span className="font-bold text-lg">{entry.position}</span>
            <span>{entry.driver}</span>
            <span className="text-center">{entry.races}</span>
            <span className="text-center">{entry.wins}</span>
            <span className="font-semibold text-red-500 text-center">
              {entry.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Standing;
