const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const tokenBlackListModel = require('../models/blacklist.model');
async function  registerUserController(req, res){
    const {username,email,password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            mesage: "please provide username email or password"
        })
    }
    const ifuserAllreadyExits = await userModel.findOne({
        $or: [{username}, {email}]
    })
     if(ifuserAllreadyExits) {
        return res.status(400).json({
            message: 'user allready exits with this username or email'
        })
     }
     const hash = await bcrypt.hash(password, 10)

     const user = await userModel.create({
        username,
        email,
        password: hash
     })
     const token  = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
     )
     res.cookie("token", token)

     res.status(201).json({
        message: 'user register successfully' ,
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
     })

}

async function loginUserController(req,res){
    const {email, password} =  req.body

    const user  = await userModel.findOne( { email } )
    if(!user){
        return res.status(400).json({
            message: "invalid  email or password" 
        })
    }

    const isPassValid = await bcrypt.compare(password, user.password)

    if(!isPassValid){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"} 
    )

    res.cookie("token", token)
    res.status(200).json({
        message: "user login successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function logoutusercontroller(req,res){
    const token = req.cookies.token;

    if(token){
         await tokenBlackListModel.create( {token} )
    }

    res.clearCookie("token")

     res.status(200).json({
        message: "user logged out successfully",

     })

}

async function getmeCOntroller(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
module.exports  = {
    registerUserController,
    loginUserController,
    logoutusercontroller,
    getmeCOntroller, 
}