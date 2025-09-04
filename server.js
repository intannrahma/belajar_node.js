const express = require('express');
const app = express();
const port = 3100;

app.use(express.json());

let movies = [
    { id: 1, title: 'LOTR', director: 'Peter Jackson', year: 2010 },
    { id: 2, title: 'The Matrix', director: 'The Wachowskis', year: 1999 },
    { id: 3, title: 'Interstellar', director: 'Christopher Nolan', year: 2014 },
];

app.use(express.json());

let directors = [
    { id: 1, name: 'intan rahma', birthYear: 2007 },
    { id: 2, name: 'miftahul', birthYear: 2000 },
    { id: 3, name: 'syaikhoni', birthYear: 1994 },
];

app.get('/', (req, res) => {
    res.send('Selamat Datang di server Node.js');
});

// MOVIES

// GET all movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

// GET movie by id
app.get('/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Movie not found');
    }
});

// POST movie
app.post('/movies', (req, res) => {
    const { title, director, year } = req.body || {};
    if (!title || !director || !year) {
        return res.status(400).json({ error: 'Title, director, and year wajib diisi' });
    }
    const newMovie = { id: movies.length + 1, title, director, year };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

// PUT movie
app.put('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    const { title, director, year } = req.body || {};
    const updatedMovie = { 
        id, 
        title: title || movies[movieIndex].title, 
        director: director || movies[movieIndex].director, 
        year: year || movies[movieIndex].year 
    };
    movies[movieIndex] = updatedMovie;
    res.json(updatedMovie);
});

// DELETE movie
app.delete('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie tidak ditemukan' });
    }
    movies.splice(movieIndex, 1);
    res.status(204).send();
});

// DIRECTORS

// GET all directors
app.get('/directors', (req, res) => {
    res.json(directors);
});

// GET director by id
app.get('/directors/:id', (req, res) => {
    const director = directors.find(d => d.id === parseInt(req.params.id));
    if (director) {
        res.json(director);
    } else {
        res.status(404).send('Director not found');
    }
});

// POST director
app.post('/directors', (req, res) => {
    const { name, birthYear } = req.body || {};
    if (!name || !birthYear) {
        return res.status(400).json({ error: 'Name and birthYear wajib diisi' });
    }
    const newDirector = { id: directors.length + 1, name, birthYear };
    directors.push(newDirector);
    res.status(201).json(newDirector);
});

// PUT director
app.put('/directors/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const directorIndex = directors.findIndex(d => d.id === id);
    if (directorIndex === -1) {
        return res.status(404).json({ error: 'Director not found' });
    }
    const { name, birthYear } = req.body || {};
    const updatedDirector = {
        id,
        name: name || directors[directorIndex].name,
        birthYear: birthYear || directors[directorIndex].birthYear
    };
    directors[directorIndex] = updatedDirector;
    res.json(updatedDirector);
});

// DELETE director
app.delete('/directors/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const directorIndex = directors.findIndex(d => d.id === id);
    if (directorIndex === -1) {
        return res.status(404).json({ error: 'Director tidak ditemukan' });
    }
    directors.splice(directorIndex, 1);
    res.status(204).send();
});

//  SERVER 
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
