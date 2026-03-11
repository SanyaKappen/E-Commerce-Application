const bcrypt = require('bcrypt')
const User = require('../models/user')
const {sendResponseError} = require('../middleware/middleware')
const {checkPassword, newToken} = require('../utils/utility.function')

const signUpUser = async (req, res) => {
  const {email, fullName, password} = req.body
  try {
    if (!email || !password) {
      return sendResponseError(400, 'Email and password are required', res)
    }

    const existing = await User.findOne({email})
    if (existing) {
      return sendResponseError(409, 'Email already exists', res)
    }

    const hash = await bcrypt.hash(password, 8)

    const user = await User.create({
      email,
      fullName,
      password: hash,
    })

    const token = newToken(user)
    return res.status(201).send({
      status: 'ok',
      token,
      user: {id: user._id, email: user.email, fullName: user.fullName},
    })
  } catch (err) {
    console.log('Eorror : ', err)
    return sendResponseError(500, 'Something wrong please try again', res)
  }
}

const signInUser = async (req, res) => {
  const {password, email} = req.body
  console.log(req.body)
  try {
    if (!email || !password) {
      return sendResponseError(400, 'Email and password are required', res)
    }

    const user = await User.findOne({email})
    if (!!!user) {
      return sendResponseError(400, 'You have to Sign up first !', res)
    }

    const same = await checkPassword(password, user.password)
    if (same) {
      let token = newToken(user)
      return res.status(200).send({
        status: 'ok',
        token,
        user: {id: user._id, email: user.email, fullName: user.fullName},
      })
    }
    return sendResponseError(400, 'InValid password !', res)
  } catch (err) {
    console.log('EROR', err)
    return sendResponseError(500, `Error ${err}`, res)
  }
}

const getUser = async (req, res) => {
  return res.status(200).send({status: 'ok', user: req.user})
}
module.exports = {signUpUser, signInUser, getUser}
