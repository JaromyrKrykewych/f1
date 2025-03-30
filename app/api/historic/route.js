import { promises as fs } from "fs";
import path from "path";

export async function GET(req) {
  try {
    const directory = path.join(process.cwd(), "data", "historic");
    // Leer todos los archivos en el directorio

    const files = await fs.readdir(directory);
    let pointsMap = new Map();
    let positionMap = new Map();
    const driverWins = new Map();
    const driverRaces = new Map();
    const scuderiaRanking = new Map();
    const scuderiaWins = new Map();

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(directory, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const circuitData = JSON.parse(fileContent);

      const addPoints = (driver, points) => {
        const currentPoints = pointsMap.get(driver) || 0;

        pointsMap.set(driver, currentPoints + points);
      };

      const addScuderiaPoints = (scuderia, points) => {
        const currentPoints = scuderiaRanking.get(scuderia) || 0;

        scuderiaRanking.set(scuderia, currentPoints + points);
      };

      // console.log("Circuit Data:", circuitData);

      circuitData.drivers.forEach(
        ({ driver, points, wins, races, positions }) => {
          addPoints(driver, points);

          //Count Wins by driver
          const currentWins = driverWins.get(driver) || 0;
          driverWins.set(driver, currentWins + wins);

          //positions
          if (!positionMap.has(driver)) {
            positionMap.set(driver, []);
          }

          positionMap.get(driver).push(...positions);

          // Count number of races the driver has participated in
          driverRaces.set(driver, (driverRaces.get(driver) || 0) + races);
        }
      );

      circuitData.scuderias.forEach(({ scuderia, points, wins }) => {
        addScuderiaPoints(scuderia, points);

        //Count wins by scuderia
        const currentWins = scuderiaWins.get(scuderia) || 0;
        scuderiaWins.set(scuderia, currentWins + wins);
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

    const scuderiaStandings = Array.from(scuderiaRanking.entries())
      .map(([scuderia, points]) => ({
        scuderia,
        points,
        wins: scuderiaWins.get(scuderia) || 0,
      }))
      .sort((a, b) => b.points - a.points);

    const positions = Array.from(positionMap.entries())
      .map(([driver, positions]) => {
        const total = positions.reduce((sum, pos) => sum + pos, 0);
        const average = (total / positions.length).toFixed(2);
        return { driver, average };
      })
      .sort((a, b) => a.average - b.average);

    // Agregar propiedad position
    positions.forEach((item, index, array) => {
      if (index > 0 && item.average === array[index - 1].average) {
        item.position = array[index - 1].position;
      } else {
        item.position = index + 1;
      }
    });

    let currentPosition = 1;

    standings.forEach((item, index, array) => {
      if (index > 0 && item.points === array[index - 1].points) {
        item.position = array[index - 1].position;
      } else {
        item.position = currentPosition;
      }
      currentPosition++;
    });

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
      positions,
      scuderiaStandings,
    });
  } catch (error) {
    // return Response.json(
    //   { error: "Error al leer los archivos JSON" },
    //   { status: 500 }
    console.error("Error in /api/standings:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
