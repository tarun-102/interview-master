const express = require('express')
const app = express();
const authRouter = require('./routes/auth.routes')
const cokieparser = require("cookie-parser")
const interviewRouter = require('./routes/interview.routes')
const cors = require('cors')


app.use(express.json());
app.use(cokieparser());


app.use(cors({
    origin: [
    "http://localhost:5173",
    "https://your-app.vercel.app"
  ],
    credentials: true,
}))


/* required all routes */
app.use('/api/auth', authRouter);


app.use('/api/interview', interviewRouter);

module.exports = app;