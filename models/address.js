const Joi = require('joi');
const mongoose = require('mongoose');

function validateAddress(category) {
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).max(15).required(),
        address: Joi.string().min(8).max(60).required(),
        address2: Joi.string().min(5).max(60).required(),
        country: Joi.string().min(3).max(30).required(),
        state: Joi.string().min(3).max(30).required(),
        city: Joi.string().min(3).max(30).required(),
    };

    return Joi.validate(category, schema);
}

exports.validateAddress = validateAddress;