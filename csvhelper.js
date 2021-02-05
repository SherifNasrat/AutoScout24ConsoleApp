const fs = require('fs');
const csv = require('csv-parser');
const { callbackify } = require('util');

const readCSV = function(csvPath){
    return new Promise((resolve,reject)=>{
        let csvData = []
        fs.createReadStream(csvPath)
          .pipe(csv())
          .on('data',(data)=> {
              csvData.push(data);
          })
          .on('end',()=>{
              resolve(csvData);
          })
    })
}

module.exports = {
    readCSV: readCSV

}