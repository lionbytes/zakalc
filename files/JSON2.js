/** From:
 * https://www.youtube.com/watch?v=HrjC6RwEpt0
 * https://heynode.com/tutorial/readwrite-json-files-nodejs
 */

const fs = require("fs");

function jsonReader(filePath, callback) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return callback && callback(err);
    }
    try {
      const object = JSON.parse(fileData);
      return callback && callback(null, object);
    } catch (err) {
      return callback && callback(err);
    }
  });
}
jsonReader("./customer.json", (err, customer) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(customer.address); // => "Infinity Loop Drive"
});

/*------------------------------------------*/

const customer = {
    name: "Newbie Co.",
    order_count: 0,
    address: "Po Box City",
}
const jsonString = JSON.stringify(customer, null, 2);

fs.writeFile('./newCustomer.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})


/*
Create a function which returns the current date (year+month+day) as a string. Create the file named this string + .json. the fs module has a function which can check for file existence named fs.stat(path, callback). With this, you can check if the file exists. If it exists, use the read function if it's not, use the create function. Use the date string as the path cuz the file will be named as the today date + .json. the callback will contain a stats object which will be null if the file does not exist.
*/
/*
// Create a JavaScript object with the table array in it
var obj = {
   table: []
};

//Add some data to it, for example:
obj.table.push({id: 1, square:2});

//Convert it from an object to a string with JSON.stringify
var json = JSON.stringify(obj);

//Use fs to write the file to disk
var fs = require('fs');
fs.writeFile('myjsonfile.json', json, 'utf8', callback);

//If you want to append it, read the JSON file and convert it back to an object
fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it is an object
    obj.table.push({id: 2, square:3}); //add some data
    json = JSON.stringify(obj); //convert it back to json
    fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
}});
*/
