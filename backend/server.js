require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require('./database/db');
const userRoute=require('./routes/user_route');
const taskRoute=require('./routes/task_route');
const challengeRoute=require('./routes/challenge_route');
// const finalizeChallenges = require('./corn/finalizeChallenges');      // Uncomment if you want to use cron job

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // this middleware is used to parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Uncomment if you want to parse URL-encoded bodies

// Enable CORS when frontend is ready
app.use(cors());

connectToDB();

app.use('/api/auth',userRoute);
app.use('/api/task',taskRoute);
app.use('/api/challenge',challengeRoute);
// Uncomment the following line to use the cron job for finalizing challenges
// finalizeChallenges(); // Uncomment if you want to use cron job



// Routes
// app.get('/', (req, res) => {
//     res.send("hello world");
//     // or res.json({ text: "hello world" });
// });

// Server start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
