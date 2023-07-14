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
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let dotEnvPath = process.env.ENV_MODE === "production" ? ".env.production" : ".env.develop";
require('dotenv').config({path: dotEnvPath});

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
const DB_DIALECT = "postgres";
const dbPassword = DB_PASSWORD ? DB_PASSWORD : null; 

// Connect to the PostgreSQL database.
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {host: DB_HOST, dialect: DB_DIALECT, port: DB_PORT});

// Define the user model.
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

// api to retrieve all users.
app.get("/api/users", async (req, res) => {
    try {
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
    
        const users = await User.findAndCountAll({limit, offset: (page-1) * limit});
        res.status(200).json({message: "retrieve successful", users: users});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }
});

// api to retrieve user data by id.
app.get("/api/users/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await User.findByPk(userId);
    
        if (!user) {
            res.status(404).json({message: "user not found"});
            return;
        }
    
        res.status(200).json({message: "retrieve sucessful", user});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

// create user and save to storage.
app.post("/api/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.create({name, email});
    
        if (!user) res.status(500).json({message: "Internal Server Error"});
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

// edit user and save changes to storage.
app.put("/api/users/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await User.findByPk(userId);
        const { name, email } = req.body;
        if (user) {
            user.name = name;
            user.email = email;
            user.save();
        } else {
            res.status(404).json({message: "user not found"});
            return;
        }
    
        res.status(200).json({message: `user ${userId} has been edited`, user: {name, email}});
        return;
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

// delete user by id.
app.delete("/api/users/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await User.findByPk(userId);
        if (user) {
            await user.destroy();
        } else {
            res.status(404).json({message: `user ${userId} not found`});
            return;
        }
    
        res.status(204).json({message: `user ${userId} deleted`});
        return 
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

// Sync the model with the database and start the server
sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
