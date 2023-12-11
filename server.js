const express = require('express'); // importuje server
const app = express();  // uruchomienie servera

// import routes
const testimonialsRoutes = require('./routes/testimonial.routes');
const concertRoutes = require('./routes/concert.routes');
const seatRoutes = require('./routes/seat.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', testimonialsRoutes);
app.use('/api', concertRoutes);
app.use('/api', seatRoutes);

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});