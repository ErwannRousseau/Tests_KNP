import axios from 'axios';

const API_URL =
  'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?select=region,%20gazole_prix,%20sp95_prix,%20sp98_prix,%20adresse,%20cp,%20ville&where=region%20is%20not%20null';

async function getTotalCount() {
  try {
    const { data } = await axios.get(`${API_URL}&limit=1`);
    return data.total_count;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération du nombre total de résultats : ${error.message}`);
  }
}

async function getAllResults(total_count) {
  const limit = 100;
  let offset = 0;
  let allResults = [];

  while (offset < total_count) {
    const remainingResults = total_count - offset;
    const currentLimit = Math.min(remainingResults, limit);

    const { data } = await axios.get(`${API_URL}&limit=${currentLimit}&offset=${offset}`);
    const stations = data.results;

    allResults = allResults.concat(stations);
    offset += currentLimit;
  }

  return allResults;
}

function sortStationsByRegion(allResults) {
  const stationsByRegion = allResults.reduce((groupedStations, currentStation) => {
    const updatedGroupedStations = { ...groupedStations };
    if (!updatedGroupedStations[currentStation.region]) {
      updatedGroupedStations[currentStation.region] = [];
    }
    updatedGroupedStations[currentStation.region].push(currentStation);
    return updatedGroupedStations;
  }, {});
  return Object.entries(stationsByRegion);
}

function findCheapestFuelInRegions(regionsArray) {
  const result = [];

  for (let i = 0; i < regionsArray.length; i++) {
    const region = regionsArray[i];
    const regionName = region[0];
    const stations = region[1];

    // Initializes minimum prices to null
    let minGazolePrice = null;
    let minSP95Price = null;
    let minSP98Price = null;

    for (let y = 0; y < stations.length; y++) {
      const station = stations[y];
      const { gazole_prix, sp95_prix, sp98_prix, adresse, cp, ville } = station;

      // Converts prices into numbers for comparison
      // Use Infinity as fallback value to avoid null comparison
      const gazolePrice = gazole_prix !== null ? parseFloat(gazole_prix) : Infinity;
      const sp95Price = sp95_prix !== null ? parseFloat(sp95_prix) : Infinity;
      const sp98Price = sp98_prix !== null ? parseFloat(sp98_prix) : Infinity;

      //  Update minimum prices
      if (gazolePrice < minGazolePrice?.gazolePrice || minGazolePrice === null) {
        minGazolePrice = { gazolePrice, adresse, cp, ville };
      }

      if (sp95Price < minSP95Price?.sp95Price || minSP95Price === null) {
        minSP95Price = { sp95Price, adresse, cp, ville };
      }

      if (sp98Price < minSP98Price?.sp98Price || minSP98Price === null) {
        minSP98Price = { sp98Price, adresse, cp, ville };
      }
    }

    // Creates the result object for the region
    const regionResult = {
      region: regionName,
      gazole: minGazolePrice !== null ? minGazolePrice : null,
      sp95: minSP95Price !== null ? minSP95Price : null,
      sp98: minSP98Price !== null ? minSP98Price : null,
    };

    // Adds the result object to the result array
    result.push([regionResult]);
  }

  return result;
}

function displayCheapestFuelInRegions(cheapestFuelInRegions) {
  for (let i = 0; i < cheapestFuelInRegions.length; i++) {
    const region = cheapestFuelInRegions[i];
    const { region: regionName, gazole, sp95, sp98 } = region[0];

    console.log(`${regionName} :`);
    console.log(`  Gazole : ${gazole.gazolePrice} € / ${gazole.adresse} ${gazole.cp} ${gazole.ville}`);
    console.log(`  SP95 : ${sp95.sp95Price} € / ${sp95.adresse} ${sp95.cp} ${sp95.ville}`);
    console.log(`  SP98 : ${sp98.sp98Price} € / ${sp98.adresse} ${sp98.cp} ${sp98.ville}`);
    console.log('------------------------');
  }
}

async function getCheapestFuelPricesByRegion() {
  try {
    const total_count = await getTotalCount();
    const allResults = await getAllResults(total_count);
    const stationsByRegion = sortStationsByRegion(allResults);
    const cheapestFuelInRegions = findCheapestFuelInRegions(stationsByRegion);
    displayCheapestFuelInRegions(cheapestFuelInRegions);
  } catch (error) {
    console.error(error.message);
  }
}

getCheapestFuelPricesByRegion();

/**
 * ? How to run this script
 * Open a terminal and run the following commands:
 * $ cd exo2
 * $ npm install
 * $ node exo2/app.js
 */
