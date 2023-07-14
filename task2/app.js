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

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const inMemoryCache = {
    "users": [
        {name: "alif", email: "alive@domain.com"},
        {name: "broto", email: "broto@domain.com"},
        {name: "caca", email: "caca@domain.com"},
    ]
};

const USER_NOT_FOUND = 1;
// Exception is an error object.
function Exception(code, message) {
    this.code = code;
    this.message = message;
}

// userSave is used to emulate memory save, returning index.
function userSave({ name, email }) {
    inMemoryCache["users"].push({name, email});
    return inMemoryCache["users"].length;
}

// getUserById is used to emulate user retrieve by user id.
function getUserById(userId) {
    if (inMemoryCache["users"].length < userId) return null;
    return inMemoryCache["users"][userId];
}

// listAllUsers is used to emulate retrieve all users with limit and offset.
function listAllUsers(filter) {
    const { limit, page } = filter;
    const offset = (page - 1) * limit;
    
    return inMemoryCache["users"].slice(offset, offset+limit);
}

// editUserById is used to emulate db to edit user by id.
function editUserById(id, {name, email}) {
    const user = inMemoryCache["users"][id];
    if (!user) throw new Exception(USER_NOT_FOUND, "user not found");

    user.name = name;
    user.email = email;
    inMemoryCache["users"][id] = user;
}

// deleteUserById is used to emulate db to delete user by id.
function deleteUserBydId(id) {
    inMemoryCache["users"][id] = null;
}

// api to retrieve all users.
app.get("/api/users", (req, res) => {
    let page = 1;
    let limit = 10;

    if (typeof req.query["page"] !== undefined) {
        let p = parseInt(req.query["page"]);
        if (p > 0) page = p;
    }

    if (typeof req.query["limit"] !== undefined) {
        let l = parseInt(req.query["limit"]);
        if (l > 0) limit = l;
    }

    const users = listAllUsers({page, limit});
    res.status(200).json({message: "retrieve successful", users: users});
});

// api to retrieve user data by id.
app.get("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const user = getUserById(userId);

    if (!user) {
        res.status(404).json({message: "user not found"});
        return;
    }

    res.status(200).json({message: "retrieve sucessful", user});
});

// create user and save to storage.
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;
    const userData = {name, email};
    let index = userSave(userData);

    if (index < 0) res.status(500).json({message: "Internal Server Error"});
    res.status(201).json(userData);
});

// edit user and save changes to storage.
app.put("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const user = getUserById(req.params.id);
    const { name, email } = req.body;
    if (user) {
        editUserById(userId, {name, email});
    } else {
        res.status(404).json({message: "user not found"});
        return;
    }

    res.status(200).json({message: `user ${userId} has been edited`, user: {name, email}});
});

// delete user by id.
app.delete("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const user = getUserById(userId);
    if (user) {
        deleteUserBydId(userId);
    } else {
        res.status(404).json({message: `user ${userId} not found`});
        return;
    }

    res.status(204).json({message: `user ${userId} deleted`});
});

// start the server
app.listen(port, () => {
    console.log(`Server is served at port ${port}`)
});