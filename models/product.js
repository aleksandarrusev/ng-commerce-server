const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category');

const Product = mongoose.model('Products', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    category: {
        type: categorySchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    imageURL: {
        type: String,
        required: false,
        min: 0,
    },
    description: {
        type: String,
        required: false,
        min: 0,
    }

}));

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        category: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        imageURL: Joi.string().min(0).required(),
        price: Joi.number().min(0).required(),
        description: Joi.string()
    };

    return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;