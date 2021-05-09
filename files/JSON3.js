/** From:
 * https://www.youtube.com/watch?v=HrjC6RwEpt0
 * https://heynode.com/tutorial/readwrite-json-files-nodejs
 */
const fs = require("fs");

function jsonReader(filePath, callback) {
  
  // fs.readFile(filepath, callback(err, jsonString))
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
    console.log("Error reading file:", err);
    return;
  }

  customer.order_count += 1;

  // fs.writeFile(filepath, jsonString, callback(err))
  fs.writeFile("./customer.json", JSON.stringify(customer, null, 2), err => {
    if (err) console.log("Error writing file:", err);
  });
});
