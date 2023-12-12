const Joi = require('joi');

function validateInput(schema) {
    return (req, res, next) => {
        //console.log('Received data:', req.body);
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }
        if (!req.value) {
            req.value = {};
        }
        req.value['body'] = value;
        next();
    };
}

module.exports = validateInput;