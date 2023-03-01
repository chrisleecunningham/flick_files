// verbiage for apidoc creation

//test


const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movie,
    Users = Models.User;

/* Use this if working locally only
mongoose.connect('mongodb://localhost:27017/flick_files', { useNewUrlParser: true, useUnifiedTopology: true }); */

mongoose.set('strictQuery', false);
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });



app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');


//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  username: String,
  password: String,
  email: String,
  birthDate: Date
}*/
app.post('/users',
   
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
    [
        check('username', 'Username is required').isLength({min:5}),
        check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('password', 'Password is required.').not().isEmpty(),
        check('email', 'Email does not appear to be valid.').isEmail()
    ],  (req, res) => {

    // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }


    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOne({ username: req.body.username }).then((user) => {
        if (user) {
            return res.status(400).send(req.body.username + 'already exists');
        }   else {
            Users
                .create({
                    username: req.body.username,
                    password: hashedPassword,
                    email: req.body.email,
                    birthDate: req.body.birthDate,
                    favoriteMovies: req.body.favoriteMovies
                })
                .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error ' + error);
                });
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error ' + error);
    });
});


// GET all users
app.get('/users', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.get('/users/:username', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.findOne( {username: req.params.username })
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
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
app.put('/users/:username', passport.authenticate('jwt', { session: false}), (req, res) => {
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


// CREATE favoriteMovies by username
app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.findOneAndUpdate({ username: req.params.username }, {
        $push: { favoriteMovies: req.params.MovieID }
    },
    { new: true },
    (error, updatedUser) => {
        if (error) {
            console.error(error);
            res.status(500). send('Error ' + error);
        }   else {
            res.json(updatedUser);
        }
    });
});


// DELETE favoriteMovies by username
app.delete('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.findOneAndUpdate({ username: req.params.username }, {
        $pull: { favoriteMovies: req.params.MovieID }
    },
    { new: true },
    (error, updatedUser) => {
        if (error) {
            console.error(error);
            res.status(500). send('Error ' + error);
        }   else {
            res.json(updatedUser);
        }
    });
});


//Delete a user by username
app.delete('/users/:username', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.findOneAndRemove({ username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found');
            }   else {
                res.status(200).send(req.params.username + ' was deleted');
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});


// GET all movies
app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {

    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});


// GET a genre by name
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false}), (req, res) => {
    Movies.findOne( {'genre.name': req.params.name })
        .then((movies) => {
            res.json(movies.genre);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error ' + error);
        });
});


// GET a director by name
app.get('/movies/director/:name', passport.authenticate('jwt', { session: false}), (req, res) => {
    Movies.findOne( {'director.name': req.params.name })
        .then((movies) => {
            res.json(movies.director);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error ' + error);
        });
});


// GET a movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false}), (req, res) => {
    Movies.findOne( {title: req.params.title })
        .then((movies) => {
            res.json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error ' + error);
        });
});



// OLD CODE JUST IN CASE
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
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});



