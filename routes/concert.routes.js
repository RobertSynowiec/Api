const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');

const validateInput = require('../validateInput');

const concertSchema = Joi.object({
    performer: Joi.string().required(),
    genre: Joi.string().required(),
    price: Joi.number().required(),
    day: Joi.number().required(),
    image: Joi.string().regex(/\/img\/uploads\/\d+\.(jpg|jpeg|png)/).required()
});

router.get('/concerts',
    // validateInput(concertSchema),
    (req, res) => {
        res.json(db.concerts);
    });

router.get('/concerts/:id',
    // validateInput(concertSchema),
    (req, res) => {
        const concertId = parseInt(req.params.id, 10);
        const concert = db.concerts.find(item => item.id === concertId);

        res.json(concert);
    });

router.post('/concerts',
    // validateInput(concertSchema),
    (req, res) => {
        const { performer, genre, price, day, image } = req.body;
        const newConcert = {
            id: db.concerts.length > 0 ? Math.max(...db.concerts.map(item => item.id)) + 1 : 1,
            performer,
            genre,
            price,
            day,
            image,
        };
        db.concerts.push(newConcert);
        res.json({ message: 'OK' });
    });
router.put('/concerts/:id',
    (req, res) => {
        const concertId = parseInt(req.params.id, 10);
        const { performer, genre, price, day, image } = req.body;

        const index = db.concerts.find(item => item.id === concertId);

        if (index === -1) {
            return res.status(404).json({ error: 'Concert not found' });
        }

        db.concerts[index] = { ...db.concerts[index], performer, genre, price, day, image };
        res.json({ message: 'OK' });
    });

router.delete('/concerts/:id',
    (req, res) => {
        const concertId = parseInt(req.params.id, 10);
        db.concerts = db.concerts.filter(item => item.id !== concertId);
        res.json({ message: 'Ok' });
    });

module.exports = router;