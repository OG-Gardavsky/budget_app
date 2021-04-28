const fetch = require('node-fetch');
const constants = require('../config/constants');
const currencyList = require('../config/currencyList');

const getListOfCurrencies = async () => {

    const res = await fetch('https://free.currconv.com/api/v7/currencies?apiKey=' + constants.currencyApiKey)

    if (res.status !== 200) {
        return currencyList;
    }

    const body = await res.json();
    const currenciesArray =  Object.values(body.results);

    return currenciesArray;
}




module.exports = { getListOfCurrencies };
