const jsonUtils = require('../utils/JsonUtils');

const configJson = jsonUtils.loadJSON('variables.json');


const jwtKey = configJson.jwtKey;


module.exports = { jwtKey };

console.log(jwtKey);

// console.log('neco')


