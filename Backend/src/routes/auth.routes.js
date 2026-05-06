const express = require('express');
const autController = require('../controllers/auth.controllers')
const authRouter = express.Router();
const authMiddlewere = require("../middlewares/auth.middleware")

authRouter.post('/register', autController.registerUserController )

authRouter.post('/login', autController.loginUserController)
 
authRouter.get('/logout', autController.logoutusercontroller)

authRouter.get('/get-me', authMiddlewere.authUser, autController.getmeCOntroller )

module.exports = authRouter;