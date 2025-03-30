import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data");
const historicPath = path.join(dataPath, "historic");

// Asegurar que la carpeta historic existe
if (!fs.existsSync(historicPath)) {
  fs.mkdirSync(historicPath, { recursive: true });
}

const generateHistoricData = () => {
  const excludeFolders = ["historic", "overall", "plantilla"];

  const circuits = fs
    .readdirSync(dataPath)
    .filter((circuit) => !excludeFolders.includes(circuit));

  circuits.forEach((circuit) => {
    const circuitPath = path.join(dataPath, circuit);

    if (fs.statSync(circuitPath).isDirectory()) {
      const pointsMap = new Map();
      const driverWins = new Map();
      const driverRaces = new Map();
      const driverPositions = new Map();
      const scuderiaRanking = new Map();
      const scuderiaWins = new Map();

      const addPoints = (driver, points) => {
        const currentPoints = pointsMap.get(driver) || 0;

        pointsMap.set(driver, currentPoints + points);
      };

      const addScuderiaPoints = (scuderia, points) => {
        const currentPoints = scuderiaRanking.get(scuderia) || 0;

        scuderiaRanking.set(scuderia, currentPoints + points);
      };

      const files = fs.readdirSync(circuitPath);
      files.forEach((file) => {
        if (file.endsWith(".json")) {
          const filePath = path.join(circuitPath, file);
          const raceData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

          if (raceData.results) {
            raceData.results.forEach(
              ({ driver, pointsRace, position, scuderia }) => {
                addPoints(driver, pointsRace);
                addScuderiaPoints(scuderia, pointsRace);

                // Count wins (if position is 1)
                if (position === 1) {
                  driverWins.set(driver, (driverWins.get(driver) || 0) + 1);
                  scuderiaWins.set(
                    scuderia,
                    (scuderiaWins.get(scuderia) || 0) + 1
                  );
                }

                // Count number of races the driver has participated in
                driverRaces.set(driver, (driverRaces.get(driver) || 0) + 1);

                // 🔹 Guardar todas las posiciones de cada piloto
                if (!driverPositions.has(driver)) {
                  driverPositions.set(driver, []);
                }
                driverPositions.get(driver).push(position);
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
      });

      const standings = Array.from(pointsMap.entries())
        .map(([driver, points]) => ({
          driver,
          points,
          wins: driverWins.get(driver) || 0,
          races: driverRaces.get(driver) || 0,
          positions: driverPositions.get(driver) || [],
        }))
        .sort((a, b) => b.points - a.points || b.wins - a.wins);

      const scuderiaStandings = Array.from(scuderiaRanking.entries())
        .map(([scuderia, points]) => ({
          scuderia,
          points,
          wins: scuderiaWins.get(scuderia) || 0,
        }))
        .sort((a, b) => b.points - a.points);

      // Guardar en un archivo JSON
      const filePath = path.join(historicPath, `${circuit}.json`);
      fs.writeFileSync(
        filePath,
        JSON.stringify(
          { drivers: standings, scuderias: scuderiaStandings },
          null,
          2
        )
      );
      console.log(`Histórico guardado para ${circuit}.`);
    }
  });

  console.log("✅ Históricos generados correctamente.");
};

generateHistoricData();
