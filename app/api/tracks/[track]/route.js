import { promises as fs } from "fs";
import path from "path";

export async function GET(req, { params }) {
  const { track } = await params;

  try {
    const directory = path.join(process.cwd(), "data", track);
    // Leer todos los archivos en el directorio

    const files = await fs.readdir(directory);
    let pointsMap = new Map();
    let positionMap = new Map();
    const driverWins = new Map();
    const driverRaces = new Map();
    const lapsLedMap = new Map();
    const overallRanking = new Map();
    const scuderiaRanking = new Map();
    const scuderiaPosition = new Map();

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(directory, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const raceData = JSON.parse(fileContent);

      const addPoints = (driver, points, fastedLap) => {
        const currentPoints = pointsMap.get(driver) || 0;

        // if (fastedLap) {
        //   points += 1;
        // }

        pointsMap.set(driver, currentPoints + points);
      };

      const addScuderiaPoints = (scuderia, points, fastedLap) => {
        const currentPoints = scuderiaRanking.get(scuderia) || 0;

        // if (fastedLap) {
        //   points += 1;
        // }

        scuderiaRanking.set(scuderia, currentPoints + points);
      };

      if (raceData.results) {
        raceData.results.forEach(
          ({ driver, pointsRace, position, lapsLed, fastedLap, scuderia }) => {
            addPoints(driver, pointsRace, fastedLap);
            addScuderiaPoints(scuderia, pointsRace, fastedLap);
            if (!positionMap.has(driver)) {
              positionMap.set(driver, []);
            }
            if (!scuderiaPosition.has(scuderia)) {
              scuderiaPosition.set(scuderia, []);
            }
            positionMap.get(driver).push(position);
            scuderiaPosition.get(scuderia).push(position);

            // Count wins (if position is 1)
            if (position === 1) {
              driverWins.set(driver, (driverWins.get(driver) || 0) + 1);
            }

            // Count number of races the driver has participated in
            driverRaces.set(driver, (driverRaces.get(driver) || 0) + 1);

            //Count lapsLed by driver
            const currentLaps = lapsLedMap.get(driver) || 0;
            lapsLedMap.set(driver, currentLaps + lapsLed);
          }
        );
      }
      if (raceData.sprint) {
        raceData.sprint.forEach(({ driver, pointsRace, scuderia }) => {
          addPoints(driver, pointsRace);
          addScuderiaPoints(scuderia, pointsRace);
        });
      }
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

    const scuderiaAverage = Array.from(scuderiaPosition.entries())
      .map(([scuderia, positions]) => {
        const total = positions.reduce((sum, pos) => sum + pos, 0);
        const average = (total / positions.length).toFixed(2);
        return { scuderia, average };
      })
      .sort((a, b) => a.average - b.average);

    let scuderiaAveragePosition = 1;

    scuderiaAverage.forEach((item, index, array) => {
      if (index > 0 && item.average === array[index - 1].average) {
        item.position = array[index - 1].position;
      } else {
        item.position = scuderiaAveragePosition;
      }
      scuderiaAveragePosition++;
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

    // Calcular los mejores promedios de posiciones
    let bestAverages = [];

    positionMap.forEach((positions, driver) => {
      // Ordenar de mejor a peor (posición más baja es mejor)
      positions.sort((a, b) => a - b);

      // Si tiene menos de 3 carreras, completar con posiciones ficticias (50)
      while (positions.length < 3) {
        positions.push(20);
      }

      const best = positions[0];
      const second = positions[1];
      const third = positions[2];
      const average = ((best + second + third) / 3).toFixed(2); // Promedio de las mejores 3

      bestAverages.push({ driver, average, best, second, third });
    });

    // Ordenar por mejor promedio (de menor a mayor)
    bestAverages.sort((a, b) => a.average - b.average);

    // Agregar propiedad position
    bestAverages.forEach((item, index, array) => {
      if (index > 0 && item.average === array[index - 1].average) {
        item.position = array[index - 1].position;
      } else {
        item.position = index + 1;
      }
    });

    // Ordenar pilotos con mas vueltas lideradas
    const lapsLedStandings = [...lapsLedMap.entries()]
      .sort((a, b) => b[1] - a[1]) // Ordenar de mayor a menor
      .map(([driver, lapsLed], index) => ({
        position: index + 1,
        driver,
        lapsLed,
      }));

    // Recorrer cada tabla de posiciones
    [standings, positions, bestAverages].forEach((ranking) => {
      ranking.forEach((item) => {
        const driver = item.driver;
        const position = item.position;

        if (!driver) return;

        overallRanking.set(
          driver,
          (overallRanking.get(driver) || 0) + position
        );
      });
    });

    // Convertir a array, calcular el promedio y ordenar de menor a mayor
    const finalRanking = Array.from(overallRanking, ([driver, total]) => ({
      driver,
      average: (total / 3).toFixed(2),
    })).sort((a, b) => a.average - b.average);

    // Asignar posiciones finales
    finalRanking.forEach((item, index) => {
      item.position = index + 1;
    });

    return Response.json({
      standings,
      positions,
      bestAverages,
      lapsLedStandings,
      finalRanking,
      scuderiaStandings,
      scuderiaAverage,
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
