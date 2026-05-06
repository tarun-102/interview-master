const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique:[true, "username already taken"]
    },
    email: {
        type: String,
        unique: [true, "Account already exits with this email"],
        required: true
    },
    password:{
        type:String,
        required: true,
    }
})

const UserModel = mongoose.model('users', userSchema)

module.exports = UserModel;