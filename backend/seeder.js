require('dotenv').config()
const mongoose = require('mongoose')

const Product = require('./models/product')
const products = require('./data/products')

const connect = async () => {
  const mongoUri =
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ECommmerce'
  await mongoose.connect(mongoUri)
}

const seed = async () => {
  await Product.deleteMany()
  await Product.insertMany(products)
  console.log(`Seeded ${products.length} products`)
}

const destroy = async () => {
  await Product.deleteMany()
  console.log('Destroyed products collection')
}

const run = async () => {
  try {
    await connect()
    const shouldDestroy = process.argv.includes('--destroy')
    if (shouldDestroy) {
      await destroy()
    } else {
      await seed()
    }
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Seeder failed:', err)
    try {
      await mongoose.disconnect()
    } catch {}
    process.exit(1)
  }
}

run()

