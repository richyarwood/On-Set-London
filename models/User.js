const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')
const _ = require('lodash')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: 'Please provide a username',
    unique: 'That username is already registered'
  },
  email: {
    type: String,
    required: 'Please provide and email address',
    unique: 'That email is already registered'
  },
  password: {
    type: String,
    required: 'Please provide a password'
  }
}, {
  toJSON: {
    virtuals: true, // add virtuals to the JSON
    transform(doc, json) {
      delete json.password // delete the password
      delete json._locations
      delete json.__v
      return json
    }
  },
  toObject: { virtuals: true }
})


// this is a special virtual that will aggregate
// all the locations and films that a specific user has created
// NB: **This needs to be populated in the controller**
userSchema.virtual('_locations', {
  localField: '_id',
  foreignField: 'sceneNotes.createdBy',
  ref: 'Location'
})

userSchema.virtual('locations')
  .get(function() {
    return _.uniqBy(this._locations, '_id')
  })

userSchema.virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(plaintext) {
    this._passwordConfirmation = plaintext
  })

// LIFECYCLE HOOKS
userSchema.pre('validate', function checkPasswords(next) {
  if(this.isModified('password') && this._passwordConfirmation !== this.password) {
    this.invalidate('passwordConfirmation', 'Passwords do not match')
  }
  next()
})

userSchema.pre('save', function hashPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8))
  }

  next()
})

userSchema.methods.isPasswordValid = function isPasswordValid(plaintext) {
  return bcrypt.compareSync(plaintext, this.password)
}

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
