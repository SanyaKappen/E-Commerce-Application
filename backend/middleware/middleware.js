const User = require('../models/user')
const {verifyToken} = require('../utils/utility.function')

const sendResponseError = (status, message, res) => {
  res.status(status).send({status: 'error', message})
}

const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null

    if (!token) {
      return sendResponseError(401, 'Missing Authorization Bearer token', res)
    }

    const payload = await verifyToken(token)
    const user = await User.findById(payload.id).select('-password')

    if (!user) {
      return sendResponseError(401, 'Invalid token user', res)
    }

    req.user = user
    next()
  } catch (err) {
    console.log('AUTH ERROR:', err)
    sendResponseError(401, 'Invalid token', res)
  }
}

module.exports = {sendResponseError, requireAuth}
