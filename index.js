const express = require('express'),
    const morgan = require('morgan'),
    const http = require('http');

const host = 'localhost';
const port = 8080;    
const app = express();


let topTenMovies = [
    {
        title: 'Shawshank Redemption',
        starring: 'Tim Robbins',
        writer: 'Frank Darabont'
        director: 'Frank Darabont'
    },
    {
        title: 'Braveheart',
        starring: 'Mel Gibson',
        writer: 'Randall Wallace',
        director: 'Mel Gibson'
    },
    {
        title: 'Saving Private Ryan',
        starring: 'Tom Hanks',
        writer: 'Robert Rodat',
        director: 'Stephen Spielberg'
    },
    {
        title: 'The Departed',
        starring: 'Leonardo DiCaprio',
        writer: 'William Monahan',
        director: 'Martin Scorsese'
    },
    {
        title: 'Memento',
        starring: 'Guy Pearce',
        writer: 'Christopher Nolan',
        director: 'Christopher Nolan'
    },
    {
        title: 'Aliens',
        starring: 'Sigourney Weaver',
        writer: 'James Cameron',
        director: 'James Cameron'
    },
    {
        title: 'Toy Story',
        starring: 'Tom Hanks',
        writer: 'John Lasseter',
        director: 'John Lasseter'
    },
    {
        title: 'Avengers: Endgame',
        starring: 'Robert Downey Jr.',
        writer: 'Christopher Markus',
        director: 'Russo Brothers'
    },
    {
        title: 'Good Will Hunting',
        starring: 'Matt Damon',
        writer: 'Matt Damon',
        director: 'Gus Van Sant'
    },
    {
        title: 'Ocean\'s Eleven',
        starring: 'George Clooney',
        writer: 'George Clayton Johnson',
        director: 'Stephen Soderbergh'
    }
];

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to Flick Files!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

//Listen for requests
app.listen(8080, () => {
    console.log('Flick Files is listening on port 8080.');
});