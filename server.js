const express = require('express'); // importuje server
const path = require('path'); // importuje middleware
const app = express();  // uruchomienie servera

const db = {
    testimonials: [
        {
            id: 1,
            author: 'John Doe',
            text: 'This company is worth every coin!',
        },
        {
            id: 2,
            author: 'Amanda Doe',
            text: 'They really know how to make you happy.',
        },
    ],
}
app.use(express.urlencoded({ extended: false })); // pozwala na obsługę danych przesyłanych przez formularze w aplikacji Express.js.

app.use(express.static(path.join(__dirname, '/public'))); // middleware

// Endpoint dla randomowego id
app.get('/testimonials/random', (req, res) => {

    const randomIndex = Math.floor(Math.random() * db.testimonials.length);
    const randomElement = db.testimonials[randomIndex];
    res.json(randomElement);
});
// Endpoint dla konkretnego zasobu po ID
app.get('/testimonials/:id', (req, res) => {
    const testimonialId = parseInt(req.params.id, 10);

    const testimonial = db.testimonials.find(item => item.id === testimonialId);

    if (!testimonial) {
        return res.status(404).json({ error: 'Not found...' });
    }

    res.json(testimonial);
});

app.get('/testimonials', (req, res) => {
    res.json(db.testimonials);; // endpoint zwracający wszytkie dane z tablicy db
});

// Endpoint dla dodawania nowego elementu
app.post('/testimonials', (req, res) => {
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
app.put('/testimonials/:id', (req, res) => {
    const resourceId = parseInt(req.params.id, 10);
    const { author, text } = req.body;

    const existingElement = db.testimonials.find(item => item.id === resourceId);

    if (!existingElement) {
        return res.status(404).json({ error: 'Not found...' });
    }

    // Modyfikacja author i text
    if (author) {
        existingElement.author = author;
    }
    if (text) {
        existingElement.text = text;
    }

    res.json({ message: 'Ok' });
});
// Endpoint do usuwania elementu po ID
app.delete('/testimonials/:id', (req, res) => {
    const resourceId = parseInt(req.params.id, 10);
    db.testimonials = db.testimonials.filter(item => item.id !== resourceId);

    res.json({ message: 'Ok' });
});

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

// ustawieni portu lokalnego
app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
