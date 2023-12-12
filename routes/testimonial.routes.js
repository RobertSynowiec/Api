const express = require('express');
const router = express.Router();
const Joi = require('joi');
const db = require('../db');

const validateInput = require('../validateInput');

const testimonialSchema = Joi.object({
    id: Joi.number().required(),
    author: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),
    text: Joi.string().required(),
});

// Endpoint dla randomowego id
router.get('/testimonials/random',
    (req, res) => {
        res.json(
            db.testimonials[Math.floor(Math.random() * db.testimonials.length)]
        );
    }
);

// Endpoint dla wszytkich
router.get('/testimonials',
    //validateInput(testimonialSchema),
    (req, res) => {
        res.json(db.testimonials);
    });

// Endpoint dla konkretnego zasobu po ID
router.get('/testimonials/:id',
    // validateInput(testimonialSchema),
    (req, res) => {
        const testimonialId = parseInt(req.params.id, 10);
        const testimonial = db.testimonials.find(item => item.id === testimonialId);

        if (!testimonial) {
            return res.status(404).json({ error: 'Not found...' });
        }
        res.json(testimonial);
    });

// Endpoint dla dodawania nowego elementu
router.post('/testimonials',
    validateInput(testimonialSchema),
    (req, res) => {
        const { author, text } = req.body;
        const newTestimonial = {
            id: db.testimonials.length > 0 ? Math.max(...db.testimonials.map(item => item.id)) + 1 : 1,
            author,
            text,
        };
        db.testimonials.push(newTestimonial);
        res.json({ message: 'OK' });
    });

// Endpoint dla modyfikacji author i text po ID
router.put(
    '/testimonials/:id',
    //validateInput(testimonialSchema),
    (req, res) => {
        const testimonialId = parseInt(req.params.id, 10);
        const { author, text } = req.body;
        const index = db.testimonials.findIndex(item => item.id === testimonialId);

        if (index === -1) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        db.testimonials[index] = { ...db.testimonials[index], author, text };
        res.json({ message: 'OK' });
    }
);
// Endpoint do usuwania elementu po ID
router.delete('/testimonials/:id',
    (req, res) => {
        const testimonialId = parseInt(req.params.id, 10);
        db.testimonials = db.testimonials.filter(item => item.id !== testimonialId);
        res.json({ message: 'Ok' });
    });

module.exports = router;