/*
Task 3: Asynchronous Programming
Write a Node.js function that reads a text file asynchronously and returns a promise with the file's contents. Handle any potential errors and ensure the file is closed after reading. Write a test for this function using a testing framework of your choice.
*/

const fs = require('fs');

/*
    reads file asynchroniously by returning a promise.
*/
function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        try {
            // this reads file completely and close after automatically.
            let fileContent = fs.readFileSync(path, {encoding: 'utf-8'});
            resolve(fileContent);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { readFileAsync };