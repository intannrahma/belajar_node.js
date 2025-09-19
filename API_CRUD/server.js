require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbMovies, dbDirectors } = require('./database.js'); // <- perbaikan: hapus ;; ganda
const app = express();
const PORT = process.env.PORT || 3100;
app.use(cors());

// const port = 3100;

//middleware
app.use(express.json());


//  dummy data (id,tiltte,director,year)
// let movies = [
//    { id: 1, title: 'LOTR', director: 'Peter Jackson', year: 2010 },
//    { id: 2, title: 'The Matrix', director: 'The Wachowskis', year: 1999 },
//    { id: 3, title: 'Interstellar', director: 'Christopher Nolan', year: 2014 },
// ];

let directors = [
    { id: 1, name: 'intan rahma', birthYear: 2007 },
    { id: 2, name: 'miftahul', birthYear: 2000 },
    { id: 3, name: 'syaikhoni', birthYear: 1994 },
];

// console.log(movies);

// app.get('/', (req, res) => {
//     res.send('Selamat Datang di server Node.js');
// });

app.get('/', (req, res) => {
    res.json({
        message: 'Selamat Datang di server Node.js Tahap Awal, terimakasih',
    });
});

app.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date(),
    });
});

// GET semua movies
app.get('/movies', (req, res) => {
  const sql = "SELECT * FROM movies ORDER BY id ASC";
  dbMovies.all(sql, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// GET movie by id
app.get('/movies/:id', (req, res) => {
  const sql = "SELECT * FROM movies WHERE id = ?";
  dbMovies.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Movie not found" });
    res.json(row);
  });
});

// POST movie baru
app.post('/movies', (req, res) => {
  const { title, director, year } = req.body;
  if (!title || !director || !year) {
    return res.status(400).json({ error: "title, director, year is required" });
  }
  const sql = 'INSERT INTO movies (title, director, year) VALUES (?,?,?)';
  dbMovies.run(sql, [title, director, year], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, director, year });
  });
});

// Update movies
app.put("/movies/:id", (req, res) => {
  const { title, director, year } = req.body;
  dbMovies.run(
    "UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?",
    [title, director, year, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE movies
app.delete("/movies/:id", (req, res) => {
  // perbaikan: parameter harus dikirim sebagai array [req.params.id]
  dbMovies.run("DELETE FROM movies WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});


// GET semua director
app.get('/directors', (req, res) => {
  dbDirectors.all("SELECT * FROM directors", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET director by id
app.get('/directors/:id', (req, res) => {
  dbDirectors.get("SELECT * FROM directors WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Director not found" });
    res.json(row);
  });
});

// CREATE sutradara
app.post('/directors', (req, res) => {
  const { name, birthYear } = req.body;
  dbDirectors.run(
    "INSERT INTO directors (name, birthYear) VALUES (?, ?)",
    [name, birthYear],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, birthYear });
    }
  );
});

// UPDATE sutradara
app.put('/directors/:id', (req, res) => {
  const { name, birthYear } = req.body;
  dbDirectors.run(
    "UPDATE directors SET name = ?, birthYear = ? WHERE id = ?",
    [name, birthYear, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE sutradara
app.delete('/directors/:id', (req, res) => {
  // perbaikan: parameter harus dikirim sebagai array [req.params.id]
  dbDirectors.run("DELETE FROM directors WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// information server listening
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// MOVIES

// GET all movies
// app.get('/movies', (req, res) => {
//     res.json(movies);
// });

// GET movie by id
// app.get('/movies/:id', (req, res) => {
//     const movie = movies.find(m => m.id === parseInt(req.params.id));
//     if (movie) {
//         res.json(movie);
//     } else {
//         res.status(404).send('Movie not found');
//     }
// });

// POST movie
// app.post('/movies', (req, res) => {
//     const { title, director, year } = req.body || {};
//     if (!title || !director || !year) {
//         return res.status(400).json({ error: 'Title, director, and year wajib diisi' });
//     }
//     const newMovie = { id: movies.length + 1, title, director, year };
//     movies.push(newMovie);
//     res.status(201).json(newMovie);
// });

// PUT movie
// app.put('/movies/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const movieIndex = movies.findIndex(m => m.id === id);
//     if (movieIndex === -1) {
//         return res.status(404).json({ error: 'Movie not found' });
//     }
//     const { title, director, year } = req.body || {};
//     const updatedMovie = { 
//         id, 
//         title: title || movies[movieIndex].title, 
//         director: director || movies[movieIndex].director, 
//         year: year || movies[movieIndex].year 
//     };
//     movies[movieIndex] = updatedMovie;
//     res.json(updatedMovie);
// });

// DELETE movie
// app.delete('/movies/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const movieIndex = movies.findIndex(m => m.id === id);
//     if (movieIndex === -1) {
//         return res.status(404).json({ error: 'Movie tidak ditemukan' });
//     }
//     movies.splice(movieIndex, 1);
//     res.status(204).send();
// });

// DIRECTORS

// GET all directors
// app.get('/directors', (req, res) => {
//     res.json(directors);
// });

// GET director by id
// app.get('/directors/:id', (req, res) => {
//     const director = directors.find(d => d.id === parseInt(req.params.id));
//     if (director) {
//         res.json(director);
//     } else {
//         res.status(404).send('Director not found');
//     }
// });

// POST director
// app.post('/directors', (req, res) => {
//     const { name, birthYear } = req.body || {};
//     if (!name || !birthYear) {
//         return res.status(400).json({ error: 'Name and birthYear wajib diisi' });
//     }
//     const newDirector = { id: directors.length + 1, name, birthYear };
//     directors.push(newDirector);
//     res.status(201).json(newDirector);
// });

// PUT director
// app.put('/directors/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const directorIndex = directors.findIndex(d => d.id === id);
//     if (directorIndex === -1) {
//         return res.status(404).json({ error: 'Director not found' });
//     }
//     const { name, birthYear } = req.body || {};
//     const updatedDirector = {
//         id,
//         name: name || directors[directorIndex].name,
//         birthYear: birthYear || directors[directorIndex].birthYear
//     };
//     directors[directorIndex] = updatedDirector;
//     res.json(updatedDirector);
// });

// DELETE director
// app.delete('/directors/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const directorIndex = directors.findIndex(d => d.id === id);
//     if (directorIndex === -1) {
//         return res.status(404).json({ error: 'Director not found' });
//     }
//     directors.splice(directorIndex, 1);
//     res.status(204).send();
// });

//  SERVER 
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });
