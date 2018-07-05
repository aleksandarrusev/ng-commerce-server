const {Order, validate} = require('../models/order');
const {Product} = require('../models/product');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/',[auth], async (req, res) => {
    const orders = await Order.find().sort('-createdAt');
    res.send(orders);
});

router.post('/checkout',[auth], async (req, res) => {
    const orders = await Order.find().sort('-createdAt');
    res.send(orders);
});


router.post('/',[auth], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.user.id);
    if (!user) return res.status(400).send('Invalid user.');

    const address = req.body.address;


    const productsRaw = await req.body.products;
    if(!productsRaw.length) return res.status(400).send('No products in the cart')
    const productsArr = [];
    let total = 0;


    for (const productRaw of productsRaw) {
        if(productRaw.qty === 0) continue;

        let product = await Product.findById((productRaw.id));
        if(!product) return res.status(400).send('Invalid product id');

        productsArr.push({
            name: product.name,
            price: product.price,
            qty: productRaw.qty
        });
        total += product.price * productRaw.qty;
    }


    let order = new Order({
        user: {
            _id: user.id,
            name: user.name,
        },
        products: productsArr,
        address: address,
        totalAmount: total,
        createdAt: Date.now()
    });

    await order.save();
    res.send(order);

});

router.get('/:id',[auth], async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).send('The order with the given ID was not found.');

    res.send(order);
});

module.exports = router; 