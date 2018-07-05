const express = require('express');
const cors = require('cors');
const categories = require('../routes/categories');
const customers = require('../routes/customers');
const products = require('../routes/products');
const checkout = require('../routes/checkout');
const orders = require('../routes/orders');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(cors())
    app.use(express.json());
    app.use('/api/products', products);
    app.use('/api/checkout', checkout);
    app.use('/api/orders', orders);
    app.use('/api/categories', categories);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(error);
}