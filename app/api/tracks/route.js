import { promises as fs } from "fs";
import path from "path";

export async function GET(req) {
  try {
    const directory = path.join(process.cwd(), "data", "overall");

    const files = await fs.readdir(directory);
    let pointsMap = new Map();
    const driverWins = new Map();
    const driverRaces = new Map();

    const scuderiaPoints = new Map();
    const scuderiaWins = new Map();

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(directory, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const raceData = JSON.parse(fileContent);

      const addPoints = (driver, points) => {
        const currentPoints = pointsMap.get(driver) || 0;

        pointsMap.set(driver, currentPoints + points);
      };

      const addScuderiaPoints = (scuderia, points) => {
        const currentPoints = scuderiaPoints.get(scuderia) || 0;

        scuderiaPoints.set(scuderia, currentPoints + points);
      };

      raceData.drivers.forEach(({ driver, pointsRace, position }) => {
        addPoints(driver, pointsRace);

        // Count wins (if position is 1)
        if (position === 1) {
          driverWins.set(driver, (driverWins.get(driver) || 0) + 1);
        }

        // Count number of races the driver has participated in
        driverRaces.set(driver, (driverRaces.get(driver) || 0) + 1);
      });

      raceData.scuderias.forEach(({ scuderia, pointsRace, position }) => {
        addScuderiaPoints(scuderia, pointsRace);

        // Count wins (if position is 1)
        if (position === 1) {
          scuderiaWins.set(scuderia, (scuderiaWins.get(scuderia) || 0) + 1);
        }
      });
    }

    // Convertir el Map a un array ordenado
    const standings = Array.from(pointsMap.entries())
      .map(([driver, points]) => ({
        driver,
        points,
        wins: driverWins.get(driver) || 0,
        races: driverRaces.get(driver) || 0,
      }))
      .sort((a, b) => b.points - a.points || b.wins - a.wins);

    let currentPosition = 1;

    standings.forEach((item, index, array) => {
      if (index > 0 && item.points === array[index - 1].points) {
        item.position = array[index - 1].position;
      } else {
        item.position = currentPosition;
      }
      currentPosition++;
    });

    const scuderiaStandings = Array.from(scuderiaPoints.entries())
      .map(([scuderia, points]) => ({
        scuderia,
        points,
        wins: scuderiaWins.get(scuderia) || 0,
      }))
      .sort((a, b) => b.points - a.points || b.wins - a.wins);

    let currentScuderiaPosition = 1;

    scuderiaStandings.forEach((item, index, array) => {
      if (index > 0 && item.points === array[index - 1].points) {
        item.position = array[index - 1].position;
      } else {
        item.position = currentScuderiaPosition;
      }
      currentScuderiaPosition++;
    });

    return Response.json({
      standings,
      scuderiaStandings,
    });
  } catch (error) {
    console.error("Error in /api/standings:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
