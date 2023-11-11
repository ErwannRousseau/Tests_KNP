import axios from 'axios';

// Base API URL
const API_URL =
  'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?select=';

// Array of regions code to fetch data
const REGIONS_CODE = [11, 24, 27, 28, 32, 44, 52, 53, 75, 76, 84, 93, 94];

// Array of fuel types to fetch data
const FUEL_TYPES = ['gazole', 'sp95', 'sp98'];

/**
 * Fetch data from the API
 * @param {string} dataType - Type of data to fetch
 * @param {number} regionCode - Region code to fetch data
 * @param {string} fuelType - Fuel type to fetch data
 * @returns {object} - Data fetched
 */
async function fetchFuelStationsData(dataType, regionCode, fuelType = '') {
  let PARAMS_URL;

  if (dataType === 'region_name') {
    PARAMS_URL = `region&where=code_region%3D${regionCode}&limit=1`;
  }
  if (dataType === 'price') {
    PARAMS_URL = `adresse%2C%20cp%2C%20ville%2C%20${fuelType}_prix%20as%20prix&where=code_region%3D${regionCode}&order_by=${fuelType}_prix&limit=1`;
  }

  try {
    const { data } = await axios.get(`${API_URL}${PARAMS_URL}`);
    return data;
  } catch (error) {
    throw new Error(`Error retrieving fuel station data: ${error.message}`);
  }
}

/**
 * Get lowest fuel prices for each region
 * @returns {Array} - List of lowest fuel prices by region
 */
async function getLowestFuelPricesByRegion() {
  const lowestFuelPricesByRegion = [];

  for (const regionCode of REGIONS_CODE) {
    // Get region name
    const regionName = await getRegionName(regionCode);

    const fuelPrices = [];

    // Get lowest fuel price for each fuel type in the current region
    for (const fuelType of FUEL_TYPES) {
      const lowestFuelPrice = await getLowestFuelPriceData(regionCode, fuelType);
      fuelPrices.push(
        `${fuelType} : ${lowestFuelPrice.prix} € / ${lowestFuelPrice.adresse}, ${lowestFuelPrice.cp} ${lowestFuelPrice.ville}`,
      );
    }

    lowestFuelPricesByRegion.push({ [regionName]: fuelPrices });
  }
  return lowestFuelPricesByRegion;
}

/**
 * Get the region name
 * @param {number} regionCode - Region code to fetch data
 * @returns {string} - The region name
 */
async function getRegionName(regionCode) {
  const { results } = await fetchFuelStationsData('region_name', regionCode);
  const regionName = results[0].region;
  return regionName;
}

/**
 * Get lowest fuel price for a region
 * @param {number} regionCode - Region code to fetch data
 * @param {string} fuelType - Fuel type to fetch data
 * @returns {Object} - Object containing : lowest fuel price, address, postal code and city
 */
async function getLowestFuelPriceData(regionCode, fuelType) {
  const { results } = await fetchFuelStationsData('price', regionCode, fuelType);
  const lowestFuelPrice = results[0];
  return lowestFuelPrice;
}

/**
 * Display lowest fuel prices in regions
 * @param {Array} resultList - List of lowest fuel prices in regions
 */
function displayLowestFuelPricesByRegion(resultList) {
  for (const region of resultList) {
    const regionName = Object.keys(region)[0];
    console.log(`${regionName} :`);

    const fuelPrices = region[regionName];
    for (const fuelPrice of fuelPrices) {
      console.log(`  ${fuelPrice}`);
    }

    console.log('------------------------');
  }
}

/**
 * Main function
 */
async function getLowestPrices() {
  try {
    const resultList = await getLowestFuelPricesByRegion();
    displayLowestFuelPricesByRegion(resultList);
  } catch (error) {
    console.error(error.message);
  }
}

getLowestPrices();

/**
 * ? How to run this script
 * Open a terminal and run the following commands:
 * $ cd exo2
 * $ npm install
 * $ node improvedApp.js
 */
