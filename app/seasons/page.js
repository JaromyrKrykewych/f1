import Link from "next/link";

const seasons = [
  {
    year: 2025,
    leader: "Lando Norris",
    races: 3,
    path: "/seasons/2025",
  },
  {
    year: 2024,
    leader: "Max Verstappen",
    races: 7,
    path: "/seasons/2024",
  },
  {
    year: 2023,
    leader: "Max Verstappen",
    races: 5,
    path: "/seasons/2023",
  },
  {
    year: 2022,
    leader: "Charles Leclerc",
    races: 6,
    path: "/seasons/2022",
  },
  {
    year: 2019,
    leader: "Valtteri Bottas",
    races: 3,
    path: "/seasons/2019",
  },
  {
    year: 2018,
    leader: "Daniel Ricciardo",
    races: 1,
    path: "/seasons/2018",
  },
  {
    year: 2017,
    leader: "Lewis Hamilton",
    races: 1,
    path: "/seasons/2017",
  },
];

const SeasonsPage = () => {
  return (
    <div className="p-4 min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {seasons.map((track, index) => (
          <Link
            key={index}
            href={track.path}
            className="bg-gradient-to-b from-gray-800 to-gray-600 p-4 rounded-2xl shadow-lg border border-gray-500 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 bg-red-500 h-full"></div>
            <h2 className="text-xl font-bold text-white">{track.year}</h2>
            <p className="text-gray-300 italic">Leader: {track.leader}</p>
            <p className="text-sm text-gray-400">{`${track.races} ${
              track.races === 1 ? "race" : "races"
            }`}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeasonsPage;
