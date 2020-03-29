const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require("../adapters/mongoose");
const { privateToken } = require('../config/app');
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  username: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 255,
      unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  tokens: [{
    token: {
        type: String,
        required: true
    }
  }]

}, {timestamps : true});

//custom method to generate authToken 
UserSchema.methods.generateAuthToken = async function() { 
  const user = this
  const token = jwt.sign({ _id: this._id }, privateToken); //get the private key from the config file -> environment variable
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token;
}

UserSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email })
  console.log(email)
  if (!user) {
      throw new Error({ error: 'Invalid login credentials' })
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
      throw new Error({ error: 'Invalid login credentials' })
  }
  return user
}

const User = mongoose.model('Users', UserSchema);

//function to validate user 
function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(50),
    email: Joi.string().min(5).max(255).required().email(),
    username: Joi.string().min(4).max(255).required(),
    password: Joi.string().min(3).max(255).required()
  };

  return Joi.validate(user, schema);
}
module.exports = { User , validateUser }; 
