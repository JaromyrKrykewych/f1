import Link from "next/link";

const tracks = [
  {
    name: "Melbourne",
    alias: "Australia Grand Prix",
    races: 5,
    path: "/tracks/melbourne",
  },
  {
    name: "Shanghai",
    alias: "Chinese Grand Prix",
    races: 5,
    path: "/tracks/shanghai",
  },
  {
    name: "Suzuka",
    alias: "Japanese Grand Prix",
    races: 5,
    path: "/tracks/suzuka",
  },
  {
    name: "Bahrain",
    alias: "Bahrain Grand Prix",
    races: 3,
    path: "/tracks/bahrain",
  },
  {
    name: "Jeddah",
    alias: "Saudi Arabian Grand Prix",
    races: 3,
    path: "/tracks/jeddah",
  },
  {
    name: "Miami",
    alias: "Miami Grand Prix",
    races: 3,
    path: "/tracks/miami",
  },
  {
    name: "Imola",
    alias: "Emilia Romagna Grand Prix",
    races: 3,
    path: "/tracks/imola",
  },
];

const Tracks = () => {
  return (
    <div className="p-4 min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {tracks.map((track, index) => (
          <Link
            key={index}
            href={track.path}
            className="bg-gradient-to-b from-gray-800 to-gray-600 p-4 rounded-2xl shadow-lg border border-gray-500 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 bg-red-500 h-full"></div>
            <h2 className="text-xl font-bold text-white">{track.name}</h2>
            <p className="text-gray-300 italic">{track.alias}</p>
            <p className="text-sm text-gray-400">{track.races} races</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tracks;
