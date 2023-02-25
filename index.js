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
app.use(bodyParser.urlencoded({ extended: true }));


//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  username: String,
  password: String,
  email: String,
  birthDate: Date
}*/
app.post('/users', (req, res) => {
    Users.findOne({ username: req.body.username }).then((user) => {
        if (user) {
            return res.status(400).send(req.body.username + 'already exists');
        }   else {
            Users
                .create({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    birthDate: req.body.birthDate
                })
                .then((user) => {res.status(201).json(user) }).catch((error) => {
                    console.error(error);
                    res.status(500).send('Error ' + error);
                })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error ' + error);
    });
});


// GET all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});


// GET a user by username
app.get('/users/:username', (req, res) => {
    Users.findOne( {username: req.params.username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(error);
            res.status(500).send('Error ' + error);
        });
});


// UPDATE a user's info, by username
/* We’ll expect JSON in this format
{
  username: String,
  (required)
  password: String,
  (required)
  email: String,
  (required)
  birthDate: Date
}*/
app.put('/users/:username', (req, res) => {
    Users.findOneAndUpdate({ username: req.params.username }, { $set:
        {
            username: req.body.username,
            password: req.body.password,
            email:req.body.email,
            birthDate: req.body.birthDate
        }
    },
    { new: true }, //Makes sure updated document is returned
    (error, updatedUser) => {
        if(error) {
            console.error(error);
            res.status(500).send('Error ' + error);
        }   else {
            res.json(updatedUser);
        }
    });
});


// // CREATE user function
// app.post('/users', (req, res) => {
//     const newUser = req.body;

//     if (newUser.name) {
//         newUser.id = uuid.v4();
//         users.push(newUser);
//         res.status(201).json(newUser);
//     }   else {
//         res.status(400).send('Needs a Flicking name')
//     }
// });


// //* CREATE favoriteMovies under user function
// app.post('/users/:id/:movieTitle', (req, res) => {
//     const { id, movieTitle } = req.params;
    
//     let user = users.find( user => user.id == id );

//     if (user) {
//         user.favoriteMovies.push(movieTitle);
//         res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
//     }   else {
//         res.status(400).send('No such user');
//     }
// });


// // DELETE favoriteMovies under user function
// app.delete('/users/:id/:movieTitle', (req, res) => {
//     const { id, movieTitle } = req.params;
    
//     let user = users.find( user => user.id == id );

//     if (user) {
//         user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
//         res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
//     }   else {
//         res.status(400).send('No such user');
//     }
// });


// // DELETE unregister user function
// app.delete('/users/:id', (req, res) => {
//     const { id } = req.params;
    
//     let user = users.find( user => user.id == id );

//     if (user) {
//         users = users.filter( user => user.id != id);
//         res.status(200).send(`User ${id} has been deleted`);
//     }   else {
//         res.status(400).send('No such user');
//     }
// });


// // UPDATE user name function
// app.put('/users/:id', (req, res) => {
//     const { id } = req.params;
//     const updatedUser = req.body;

//     let user = users.find( user => user.id == id );

//     if (user) {
//         user.name = updatedUser.name;
//         res.status(200).json(user);
//     }   else {
//         res.status(400).send('No such user');
//     }
// });


// // READ welcome statement function
// app.get('/', (req, res) => {
//     res.send('Welcome to Flick Files!');
// });


// // READ see all movies function
// app.get('/movies', (req, res) => {
//     res.status(200).json(movies);
// });


// // READ see one movie's info by title function
// app.get('/movies/:title', (req, res) => {
//     const { title } = req.params;
//     const movie = movies.find( movie => movie.title === title );

//     if (movie) {
//         res.status(200).json(movie);
//     }   else {
//         res.status(400).send('No such Flicking movie');
//     }
// });


// // READ genre info by name of genre function
// app.get('/movies/genre/:genreName', (req, res) => {
//     const { genreName } = req.params;
//     const genre = movies.find( movie => movie.genre.name === genreName ).genre;
    
//     if (genre) {
//         res.status(200).json(genre);
//     }   else {
//         res.status(400).send('No such Flicking genre')
//     }
// })


// // READ director info by director name function
// app.get('/movies/director/:directorName', (req, res) => {
//     const { directorName } = req.params;
//     const director = movies.find( movie => movie.director.name === directorName ).director;
        
//     if (director) {
//         res.status(200).json(director);
//     }   else {
//         res.status(400).send('No such Flicking director');
//     }
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send("Houston, we have a problem.");
//   });

// //Listen for requests
app.listen(8080, () => {
    console.log('Flick Files is listening on port 8080.');
});

