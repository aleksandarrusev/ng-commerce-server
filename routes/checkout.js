const {Product} = require('../models/product');
const {validate} = require('../models/checkout');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let total  = 0;
    const cartItems = await req.body.products;

    for (const cartItem of cartItems) {
        if(cartItem.qty === 0) continue;

        let product = await Product.findById((cartItem.id));
        if(!product) return res.status(400).send('Invalid product id');

        total += product.price * cartItem.qty;
    }

    res.send({total: total});
});


module.exports = router;