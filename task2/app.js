/*
Task 2: API Development
   Create a simple RESTful API using Node.js and Express.js with the following endpoints:
   GET /api/users: Return a JSON response with a list of users.
   GET /api/users/:id: Return a JSON response with a specific user based on the provided id.
   POST /api/users: Create a new user based on the JSON payload in the request body. Return the created user as a JSON response.
   PUT /api/users/:id: Update an existing user based on the provided id and the JSON payload in the request body. Return the updated user as a JSON response.
   DELETE /api/users/:id: Delete an existing user based on the provided id. Return a JSON response with a success message.
   Use an in-memory data store (such as an array or object) to store the user data for this exercise.
*/

/*
Data structure for user 
-> inMemoryCache["users"][] = {name: "nama", email: "email"}
if inMemoryCache["users"][index] === null then simulate not found.
*/

import express from "express";

const app = express();
const port = 3000;

const inMemoryCache = {
    "users": [
        {name: "alif", email: "alive@domain.com"},
        {name: "broto", email: "broto@domain.com"},
        {name: "caca", email: "caca@domain.com"},
    ]
};

// userSave is used to emulate memory save, returning index.
function userSave({ name, email }) {
    inMemoryCache["users"].push();
    return inMemoryCache["users"].length;
}

// getUserById is used to emulate user retrieve by user id.
function getUserById(userId) {
    if (inMemoryCache["users"].length < userId) return null;
    return inMemoryCache["users"][index];
}

// listAllUsers is used to emulate retrieve all users with limit and offset.
function listAllUsers(filter) {
    const { limit, page } = filter;
    const offset = (page - 1) * limit;
    
    return inMemoryCache["users"].slice(offset, offset+limit);
}

function editUserById(id, {name, email}) {
}

// retrieve users from inMemoryCache.
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    const userData = {name, email};
    let index = userSave(userData);

    if (index < 0) res.status(500).json({message: "Internal Server Error"});
    res.status(201).json(user);
});