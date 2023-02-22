const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');
 
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

let users = [
    {
        "id": 1,
        "name": "Chris",
        "favoriteMovies": ["The Shawshank Redemption"]
    }
];

let movies = [
    {
        "title": 'The Shawshank Redemption',
        "starring": {   "star": 'Tim Robbins', 
                        "costar": 'Morgan Freeman'
                },
        "genre": {
            "name": 'Drama',
            "description": 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        "writer": 'Frank Darabont',
        "director": {
                "name": 'Frank Darabont',
                "bio": 'Three-time Oscar nominee Frank Darabont was born in a refugee camp in Montbeliard, France, the son of Hungarian parents who had fled Budapest during the failed 1956 Hungarian revolution. Brought to America as an infant, he settled with his family in Los Angeles and attended Hollywood High School. Darabont is one of only six filmmakers in history with the unique distinction of having his first two feature films receive nominations for the Best Picture Academy Award: 1994\'s The Shawshank Redemption (1994) (with a total of seven nominations) and 1999\'s The Green Mile (1999) (four nominations). Darabont himself collected Oscar nominations for Best Adapted Screenplay for each film (both based on works by Stephen King).',
                "born": 1959.0
        }
    },
    {
        "title": 'Braveheart',
        "starring": {   "star": 'Mel Gibson', 
                        "costar": 'Sophie Marceau'
                },
        "genre": {
            "name": 'Drama',
            "description": 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        "writer": 'Randall Wallace',
        "director": {
                "name": 'Mel Gibson',
                "bio": 'Mel Columcille Gerard Gibson was born January 3, 1956 in Peekskill, New York. Mel and his family moved to Australia in the late 1960s, settling in New South Wales. After college, Mel had a few stints on stage and starred in a few TV shows. Eventually, he was chosen to star in the film Mad Max, mkaing him known worldwide. Then in 1987, Mel starred in what would become his signature series, Lethal Weapon (1987), in which he played "Martin Riggs". 1995 brought his most famous role as "Sir William Wallace" in Braveheart (1995), for which he won two Oscars for Best Picture and Best Director. From there, he made such box office hits as The Patriot (2000), Ransom (1996), and Payback (1999).',
                "born": 1956.0
        }
    },
    {
        "title": 'Saving Private Ryan',
        "starring": {   "star": 'Tom Hanks', 
                        "costar": 'Matt Damon'
                },
        "genre": {
            "name": 'Drama',
            "description": 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        "writer": 'Robert Rodat',
        "director": {
                "name": 'Steven Spielberg',
                "bio": 'One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood\'s best known director and one of the wealthiest filmmakers in the world. He has an extraordinary number of commercially successful and critically acclaimed credits to his name, either as a director, producer or writer since launching the summer blockbuster with Jaws (1975), and he has done more to define popular film-making since the mid-1970s than anyone else. Other major titles include Close Encounters of the Third Kind, E.T., Indiana Jones, The Color Purple, Jurassic Park, and Schindler\'s List.',
                "born": 1946.0
        }
    },
    {
        "title": 'The Departed',
        "starring": {   "star": 'Leonardo DiCaprio', 
                        "costar": 'Matt Damon'
                },
        "genre": {
            "name": 'Drama',
            "description": 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        "writer": 'William Monahan',
        "director": {
                "name": 'Martin Scorcese',
                "bio": 'Martin Charles Scorsese was born in Queens, New York City, and was raised in the neighborhood of Little Italy, which became an inspiration for many of his films. Despite being the most Oscar-nominated living director (Raging Bull, The Last Temptation of Christ, Goodfellas, The Age of Innocence, Gangs of New York, The Aviator, Hugo, The Wolf of Wall Street, The Irishman), only The Departed saw him taking home the trophy.',
                "born": 1942.0
        }
    },
    {
        "title": 'Memento',
        "starring": {   "star": 'Guy Pearce', 
                        "costar": 'Carrie-Anne Moss'
                },
        "genre": {
            "name": 'Thriller',
            "description": 'A thriller is a type of mystery with a few key differences. As its name suggests, thrillers tend to be action-packed and fast-paced with moments full of tension, anxiety, and fear. Without fail, they are plot-driven stories.'
        },
        "writer": 'Christopher Nolan',
        "director": {
                "name": 'Christopher Nolan',
                "bio": 'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made. Most notable works are Memento, Insomnia, Inception, Interstellar, Tenet, and is probably best known for the most recent Batman trilogy.',
                "born": 1970.0
        }
    },
    {
        "title": 'Aliens',
        "starring": {   "star": 'Sigourney Weaver', 
                        "costar": 'Michael Biehn'
                },
        "genre": {
            "name": 'Thriller',
            "description": 'A thriller is a type of mystery with a few key differences. As its name suggests, thrillers tend to be action-packed and fast-paced with moments full of tension, anxiety, and fear. Without fail, they are plot-driven stories.'
        },
        "writer": 'James Cameron',
        "director": {
                "name": 'James Cameron',
                "bio": 'James Francis Cameron was born in Kapuskasing, Ontario, Canada. After two different majors, he dropped out of college and drove trucks t support his filmmaking ambition. His big break came when he wrote and directed The Terminator, which was a low budget success and kickstarted the career of Arnold Schwarzeneggar and had several sequels. He then made more science fiction thrillers in Aliens and The Abyss. He became a household name with the making of Titanic, which was the highest grossing movie in history for 12 years until he beat his own record with Avatar.',
                "born": 1954.0
        }
    },
    {
        "title": 'Toy Story',
        "starring": {   "star": 'Tom Hanks', 
                        "costar": 'Tim Allen'
                },
        "genre": {
            "name": 'Comedy',
            "description": 'Comedy is a genre that places characters in amusing situations for the sake of humor.'
        },
        "writer": 'John Lasseter',
        "director": {
                "name": 'John Lasseter',
                "bio": 'Although born in Hollywood, John and his twin sister Johanna were raised in Whittier near Los Angeles. It was when he was in High School that he realized that he could have a career in animation and he wrote to the Walt Disney Studios but nothing happened. He then attended Calarts\' new animation school and was hired at Disney upon graduation. He later became interested in computer animation and began making a film with a friend outside of his work with Disney, which got him fired. He kept touting that computer animation was the future and got the funding to create what would become Pixar Animation, ironically later bought by Disney.',
                "born": 1957.0
        }
    },
    {
        "title": 'Avengers: Endgame',
        "starring": {   "star": 'Robert Downey Jr.', 
                        "costar": 'Chris Evans'
                },
        "genre": {
            "name": 'Action',
            "description": 'Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots.'
        },
        "writer": 'Christopher Markus',
        "director": {
                "name": 'The Russo Brothers',
                "bio": 'Anthony J. Russo and Joseph Russo are an American filmmaking and producing duo. They have directed You, Me and Dupree, Cherry and the Marvel films Captain America: The Winter Soldier, Captain America: Civil War, Avengers: Infinity War and Avengers: Endgame. Endgame is one of the highest grossing films of all time.',
                "born": 1970.0
        }
    },
    {
        "title": 'Good Will Hunting',
        "starring": {   "star": 'Matt Damon', 
                        "costar": 'Robin Williams'
                },
        "genre": {
            "name": 'Drama',
            "description": 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        "writer": 'Matt Damon',
        "director": {
                "name": 'Gus Van Sant',
                "bio": 'Gus Green Van Sant Jr. is an American filmmaker, painter, screenwriter, photographer and musician from Louisville, Kentucky who is known for directing films such as Good Will Hunting, the 1998 remake of Psycho, Gerry, Elephant, My Own Private Idaho, To Die For, Milk, Last Days, Finding Forrester, Promised Land, Drugstore Cowboy and Mala Noche.',
                "born": 1952.0
        }
    },
    {
        "title": 'Ocean\'s Eleven',
        "starring": {   "star": 'George Clooney', 
                        "costar": 'Brad Pitt'
                },
        "genre": {
            "name": 'Thriller',
            "description": 'A thriller is a type of mystery with a few key differences. As its name suggests, thrillers tend to be action-packed and fast-paced with moments full of tension, anxiety, and fear. Without fail, they are plot-driven stories.'
        },
        "writer": 'Ted Griffin',
        "director": {
                "name": 'Steven Soderbergh',
                "bio": 'Steven Andrew Soderbergh was born in Atlanta, Georgia. He became interested in filmmaking in high school and made several short films and features that did not gain commercial success oer the next several years. His first critical and commercial success was Sex, Lies and Videotape. He later was well known for the films Out of Sight, Ocean\'s Eleven, Erin Brokovich and Traffic.',
                "born": 1963.0
        }
    }
];


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
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).json(user);
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
        res.status(200).send('');
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

