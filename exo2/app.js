import axios from 'axios';

const API_URL =
  'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?select=region,%20gazole_prix,%20sp95_prix,%20sp98_prix,%20adresse,%20cp,%20ville&where=code_region%20is%20not%20null';

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

async function getCheapestFuelPricesByRegion() {
  try {
    const total_count = await getTotalCount();
    const allResults = await getAllResults(total_count);
    if (total_count !== allResults.length) {
      throw new Error('Error retrieving results');
    }
  } catch (error) {
    console.error(error.message);
  }
}

getCheapestFuelPricesByRegion();
