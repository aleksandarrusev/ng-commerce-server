const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Product} = require('../models/product')
const {Category, validateCategory} = require('../models/category');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await Category.find().sort('name');
    res.send(categories);
});

//get products from this category
router.get('/:category', async (req, res) => {
    let products;
    if (req.query.max) {
        const max = req.query.max;
        products = await Product.find(
            {
                "category.name": req.params.category,
                "price": {$lt: max}
            },
        ).sort('name');

    } else {
        products = await Product.find({"category.name": req.params.category}).sort('name');

    }
    if (!products) return res.status(400).send('Invalid category');
    res.send(products);
});


router.post('/',[auth, admin], async (req, res) => {
    const {error} = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let category = new Category({name: req.body.name});
    category = await category.save();

    res.send(category);
});

router.put('/:id',[auth, admin], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    });

    if (!category) return res.status(404).send('The category with the given ID was not found.');

    res.send(category);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id);

    if (!category) return res.status(404).send('The category with the given ID was not found.');

    res.send(category);
});

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).send('The category with the given ID was not found.');

    res.send(category);
});

module.exports = router;