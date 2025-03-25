import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data");

export async function GET(req, { params }) {
  const { year } = await params;

  // Cargar el orden de la temporada
  const seasonOrderPath = path.join(DATA_PATH, "seasonOrder.json");
  try {
    await fs.access(seasonOrderPath);
  } catch (error) {
    return Response.json(
      { error: "Archivo de orden de temporada no encontrado" },
      { status: 500 }
    );
  }

  const seasonOrderContent = await fs.readFile(seasonOrderPath, "utf8");
  const seasonOrder = JSON.parse(seasonOrderContent);

  // Verificar si hay datos para el año solicitado
  const tracks = seasonOrder[year];
  if (!tracks) {
    return Response.json({ error: "Temporada no encontrada" }, { status: 404 });
  }

  // Obtener datos de cada carrera
  const seasonData = await Promise.all(
    tracks.map(async (track) => {
      const filePath = path.join(DATA_PATH, track, `${year}.json`);
      try {
        await fs.access(filePath); // Verifica si el archivo existe
        const fileContent = await fs.readFile(filePath, "utf8");
        return {
          track,
          data: JSON.parse(fileContent),
        };
      } catch {
        return { track, data: null }; // Si no existe, retorna null
      }
    })
  );

  let pointsMap = new Map();
  const driverWins = new Map();
  const driverScuderia = new Map();
  const scuderiaRanking = new Map();

  const addPoints = (driver, points) => {
    const currentPoints = pointsMap.get(driver) || 0;
    pointsMap.set(driver, currentPoints + points);
  };

  const addScuderiaPoints = (scuderia, points) => {
    const currentPoints = scuderiaRanking.get(scuderia) || 0;
    scuderiaRanking.set(scuderia, currentPoints + points);
  };

  const setScuderia = (driver, scuderia) => {
    if (!driverScuderia.has(driver)) {
      driverScuderia.set(driver, scuderia);
    }
  };

  seasonData.forEach(({ data }) => {
    if (!data) return;
    if (data.results) {
      data.results.forEach(({ driver, finalPoints, position, scuderia }) => {
        addPoints(driver, finalPoints);
        addScuderiaPoints(scuderia, finalPoints);
        setScuderia(driver, scuderia);
        // Count wins (if position is 1)
        if (position === 1) {
          driverWins.set(driver, (driverWins.get(driver) || 0) + 1);
        }
      });
    }
    if (data.sprint) {
      data.sprint.forEach(({ driver, pointsRace, scuderia }) => {
        addPoints(driver, pointsRace);
        addScuderiaPoints(scuderia, pointsRace);
      });
    }
  });

  const standings = Array.from(pointsMap.entries())
    .map(([driver, points]) => ({
      driver,
      points,
      scuderia: driverScuderia.get(driver) || "Uknown",
      wins: driverWins.get(driver) || 0,
    }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins);

  const scuderiaStandings = Array.from(scuderiaRanking.entries())
    .map(([scuderia, points]) => ({
      scuderia,
      points,
    }))
    .sort((a, b) => b.points - a.points);

  let currentPositiom = 1;
  standings.forEach((entry, index) => {
    if (index > 0 && standings[index - 1].points > entry.points) {
      currentPositiom = index + 1;
    }
    entry.position = currentPositiom;
  });

  let currentPositionScuderia = 1;
  scuderiaStandings.forEach((entry, index) => {
    if (index > 0 && scuderiaStandings[index - 1].points > entry.points) {
      currentPositionScuderia = index + 1;
    }
    entry.position = currentPositionScuderia;
  });

  return Response.json({ standings, scuderiaStandings });
}
