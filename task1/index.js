/*
Task 1: Data Manipulation
Create a JavaScript function that accepts a number as an input and returns with result down below . Write a test for this function using a testing framework of your choice.

Input : ex : x = 50 
Output : 

1,2,Frontend,4,Backend,Frontend,7,8,Frontend,Backend,11,Frontend,13,14,Frontend 
Backend,16,17,Frontend,19,Backend,Frontend,22,23,Frontend,Backend,26,Frontend,28,29,Frontend
Backend,31,32,Frontend,34,Backend,Frontend,37,38,Frontend,Backend,41,Frontend,43,44,Frontend Backend,46,47,Frontend,49,Backend
*/

function backendFrontendFizzBuzz(x) {
    let stringBuffer = "";
    for (let i = 1; i <= x; i++) {
        if (i != 1 && i != x+1) stringBuffer += ", ";
        let frontendBackendString = [];

        if (i % 3 === 0) frontendBackendString.push("Frontend");
        if (i % 5 === 0) frontendBackendString.push("Backend");

        if (frontendBackendString.length == 0) {
            stringBuffer += i;
            continue;
        }

        stringBuffer += frontendBackendString.join(" ");
    }

    return stringBuffer;
}

x = 50;
const stringBuffer = backendFrontendFizzBuzz(x);
console.log(stringBuffer);