const mongoose = require('mongoose')

const JWT = {
  jwt: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExp: process.env.JWT_EXPIRES_IN || '7d',
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ECommmerce'
    console.log({ MONGO_URI: process.env.MONGO_URI })
    await mongoose.connect(mongoUri)

    console.log('MongoDB connection SUCCESS')
  } catch (error) {
    console.error('MongoDB connection FAIL : ',error)
    process.exit(1)
  }
}

module.exports = {connectDB, JWT}
