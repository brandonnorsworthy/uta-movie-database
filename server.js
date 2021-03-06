const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'movie_db'
  },
  console.log(`Connected to the movie_db database.`)
);

// Query database table movies
db.query('SELECT * FROM movie_db.movies', function (err, results) {
  console.log(results);
});

// Query database table reviews
db.query('SELECT * FROM movie_db.reviews', function (err, results) {
  console.log(results);
});

app.get('/api/movies', (req, res) => {
  const sql = `SELECT id, movie_name AS title FROM movies`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

app.post('/api/add-movie', (req, res) => {
  db.query(`INSERT INTO movies (movie_name) VALUES ("${req.body.name}")`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
})

// app.post('/api/update-review', (req, res) => {
//   //SELECT id FROM movies WHERE movie_name = "Indiana Jones"
//   db.query(`FROM movies SELECT WHERE id = ?;`, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });
// })

app.delete('/api/movie/:id', (req, res) => {
  db.query(`DELETE FROM movies WHERE id = ?;`, req.params.id, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
})

// Default response for any other request (Not Found)
app.use((req, res) => {
  console.log("404");
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
