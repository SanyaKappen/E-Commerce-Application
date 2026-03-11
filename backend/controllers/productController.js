const Product = require('../models/product')

const listProducts = async (req, res) => {
  try {
    const products = await Product.find().lean()
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({message: err.message || 'Failed to fetch products'})
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean()
    if (!product) return res.status(404).json({message: 'Product not found'})
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({message: err.message || 'Failed to fetch product'})
  }
}

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({message: err.message || 'Failed to create product'})
  }
}

module.exports = {listProducts, getProductById, createProduct}
