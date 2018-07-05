const Joi = require('joi');
const mongoose = require('mongoose');
const addressSchema = require('./address.js');

const Order = mongoose.model('Order', new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            id: {
                type: String,
            },
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
        }),
        required: true
    },
    address: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            phone: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 15
            },
            address: {
                type: String,
                required: true,
                minlength: 8,
                maxlength: 100,
            },
            address2: {
                type: String,
                required: false,
                minlength: 5,
                maxlength: 100,
            },
            zip: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 30,
            },
            country: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 30,
            },
            city: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 30,
            }

        })
    },
    products: [{
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            price: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            },
            qty: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
    }],
    totalAmount: {
        type: Number,
        min: 0
    },
    createdAt: {
        type: Date
    }
}));

function validateOrder(order) {
    const schema = {
        user: Joi.object().required(),
        products: Joi.array().required(),
        address: Joi.object().keys({
                name: Joi.string().min(3).required(),
                phone: Joi.string().min(3).max(15).required(),
                address: Joi.string().min(8).max(60).required(),
                address2: Joi.string().allow(null).min(5).max(60),
                country: Joi.string().min(3).max(30).required(),
                zip: Joi.string().min(3).max(30),
                city: Joi.string().min(3).max(30).required(),
            }
        ).required(),
    };

    return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;