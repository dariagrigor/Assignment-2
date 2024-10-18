const express = require('express');
const router = express.Router();
const Product = require('./models/product.model.js');

// 1. GET - Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();  // Retrieve all products from the database
    res.status(200).json(products);  // Send the retrieved products as a JSON response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET - Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);  // Find product by ID from the request parameters
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);  // Return the found product
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. POST - Add a new product
router.post('/products', async (req, res) => {
  const { name, description, price, quantity, category } = req.body;  // Extract product details from the request body

  // Create a new product instance
  const product = new Product({
    name,
    description,
    price,
    quantity,
    category
  });

  try {
    const savedProduct = await product.save();  // Save the new product to the database
    res.status(201).json(savedProduct);  // Return the newly created product
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. PUT - Update a product by ID
router.put('/products/:id', async (req, res) => {
  const { name, description, price, quantity, category } = req.body;  // Extract new product details from the request body

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,  // Find the product by ID
      { name, description, price, quantity, category },  // Update with new values
      { new: true }  // Return the updated product instead of the old one
    );
    
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });  // If no product found, return 404
    res.status(200).json(updatedProduct);  // Return the updated product
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE - Remove a product by ID
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);  // Find and delete the product by ID
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });  // If no product, return 404
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. DELETE - Remove all products
router.delete('/products', async (req, res) => {
  try {
    const result = await Product.deleteMany();  // Delete all products
    res.status(200).json({ message: 'All products deleted', deletedCount: result.deletedCount });  // Confirm deletion with count
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. GET - Search products by name
router.get('/products/search', async (req, res) => {
    const nameQuery = req.query.name;  // Extract the search query from request parameters
  
    // Check if a name is provided in the query
    if (!nameQuery) {
      return res.status(400).send('Please provide a name to search.');  // Return an error if no name is provided
    }
  
    try {
      const regex = new RegExp(nameQuery, 'i'); 
      const filteredProducts = await Product.find({ name: regex });  // Find products matching
  
      // Return the matching products (an empty array if no matches found)
      res.status(200).json(filteredProducts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
