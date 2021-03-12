const fs = require("fs");


const loadJSON = (pathToJSON) => {
    try{
        const dataBuffer = fs.readFileSync(pathToJSON);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch(e) {
        return e;
    }

}


module.exports = { loadJSON };