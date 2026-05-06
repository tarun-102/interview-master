require('dotenv').config()
const app = require('./src/app')
const connectToDB = require('./src/config/database');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const generateInterviewReport = require('./src/services/ai.servece');

connectToDB();

app.listen(3000, () =>{
    console.log("server is runnning in port number 3000")
})