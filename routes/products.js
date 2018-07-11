const {Product, validate} = require('../models/product');
const {Category} = require('../models/category');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', async (req, res) => {
    let products;
    if (req.query.q) {
        const searchTerm = req.query.q;
        const regex = new RegExp(searchTerm, 'i');
        products = await Product.find(
            {
                "name": regex,
            },
        ).limit(8).sort('name');

    }

    res.send(products);
});


router.get('/latest', async (req, res) => {

    products = await Product.find().limit(4).sort('_id');

    res.send(products);
});

router.get('/:productId', async (req, res) => {
    const product = await Product.findById(req.params.productId).sort('name');

    if (!product) return res.status(400).send('Invalid product');

    res.send(product);
});


router.post('/', [auth, admin], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid category.');

    const product = new Product({
        name: req.body.name,
        category: {
            _id: category._id,
            name: category.name
        },
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        imageURL: req.body.imageURL ? req.body.imageURL : null,
        description: req.body.description ? req.body.description : null
    });
    await product.save();

    res.send(product);
});

router.put('/:id', [auth, admin], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send('Invalid category.');

    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            category: {
                _id: category._id,
                name: category.name
            },
            numberInStock: req.body.numberInStock,
            price: req.body.price,
            imageURL: req.body.imageURL ? req.body.imageURL : null,
            description: req.body.description ? req.body.description : null
        }, {new: true});

    if (!product) return res.status(404).send('The product with the given ID was not found.');

    res.send(product);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');

    res.send(product);
});

router.get('/:id', [auth, admin], async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');

    res.send(product);
});

module.exports = router;