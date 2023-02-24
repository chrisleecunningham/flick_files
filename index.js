// verbiage for apidoc creation


const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');

const mongoose = require('mongoose'),
    Models = require('./models/models.js'),
    Movies = Models.Movie,
    Users = Models.User;

mongoose.connect('mongodb://localhost:27017/flick_files', { useNewUrlParser: true, useUnifiedTopology: true });

 
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());




// CREATE user function
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    }   else {
        res.status(400).send('Needs a Flicking name')
    }
});


// CREATE favoriteMovies under user function
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    }   else {
        res.status(400).send('No such user');
    }
});


// DELETE favoriteMovies under user function
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    }   else {
        res.status(400).send('No such user');
    }
});


// DELETE unregister user function
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    
    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`User ${id} has been deleted`);
    }   else {
        res.status(400).send('No such user');
    }
});


// UPDATE user name function
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    }   else {
        res.status(400).send('No such user');
    }
});


// READ welcome statement function
app.get('/', (req, res) => {
    res.send('Welcome to Flick Files!');
});


// READ see all movies function
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});


// READ see one movie's info by title function
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.title === title );

    if (movie) {
        res.status(200).json(movie);
    }   else {
        res.status(400).send('No such Flicking movie');
    }
});


// READ genre info by name of genre function
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.genre.name === genreName ).genre;
    
    if (genre) {
        res.status(200).json(genre);
    }   else {
        res.status(400).send('No such Flicking genre')
    }
})


// READ director info by director name function
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.director.name === directorName ).director;
        
    if (director) {
        res.status(200).json(director);
    }   else {
        res.status(400).send('No such Flicking director');
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Houston, we have a problem.");
  });

//Listen for requests
app.listen(8080, () => {
    console.log('Flick Files is listening on port 8080.');
});

