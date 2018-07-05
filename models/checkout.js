const Joi = require('joi');
const mongoose = require('mongoose');

function validateCheckout(checkout) {
    const schema = {
        products: Joi.array().items({
            id: Joi.objectId().min(3).required(),
            name: Joi.string(),
            qty: Joi.number().required(),
        })
    };

    return Joi.validate(checkout, schema);
}

exports.validate = validateCheckout;