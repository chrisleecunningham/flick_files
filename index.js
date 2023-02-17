const express = require('express'),
    const morgan = require('morgan'),
    const http = require('http');

const host = 'localhost';
const port = 8080;    
const app = express();

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
});


//Listen for requests
app.listen(8080, () => {
    console.log('Flick Files is listening on port 8080.');
});