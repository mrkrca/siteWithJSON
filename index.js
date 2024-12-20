import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import fs from "fs"


const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "permalist",
    password: "1212",
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var currentDate = new Date().getFullYear()


app.get("/", (req, res) => {
    const query = req.query;

    fs.readFile('movies.JSON', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading JSON file:", err);
            return res.status(500).send("Server Error");
        }

        const moviesData = JSON.parse(data);

       

       
        res.render("index.ejs", { movies: moviesData , query: query, currentDate});
    });
});
app.get("/new", (req, res)=>  {
    res.render("new.ejs", {movies:movies})
})

app.get("/view/:imdbID", (req, res) => {
    fs.readFile('movies.JSON', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading JSON file:", err);
            return res.status(500).send("Server Error");
        }

        const moviesData = JSON.parse(data);
      

       
        const movie = moviesData.find((m) => m.imdbID === req.params.imdbID);
        
        if (movie) {
            res.render("view.ejs", { movie , currentDate}); 
        } else {
            res.status(404).send('Movie not found');  
        }
    });
});


app.post("/new", (req, res)=>  {
    var movieName = req.body.movieName;
    var genre = req.body.genre;
    var description = req.body.description;

    movies.push({
        id: movies.length + 1,
        movieName: movieName,
        genre: genre,
        description: description,
    });

    


    res.render("new.ejs", {movies:movies, currentDate})
    
})


app.post("/searchByGenre", (req, res) => {
    let genre = req.body.genre;
  
    fs.readFile('movies.JSON', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading JSON file:", err);
            return res.status(500).send("Server Error");
        }

        const moviesData = JSON.parse(data);

        
        const filteredMovies = moviesData.filter((movie) => {
            return movie.Genre.includes(genre);
        });
        
    
        
        if (filteredMovies.length > 0) {
            
            res.render("index.ejs", { movies: filteredMovies, query: req.query, currentDate });
        } else {
            res.render("index.ejs", { movies: filteredMovies, query: req.query, currentDate });
        }
    });
});


app.post("/search", (req, res) => {
    const searchQuery = req.body.searchQuery;
  

    fs.readFile('movies.JSON', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading JSON file:", err);
            return res.status(500).send("Server Error");
        }

        const moviesData = JSON.parse(data);

        let filteredMovies = moviesData;

     
        if (searchQuery) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.Title.toLowerCase().includes(searchQuery.toLowerCase()) 
            );
        }

        // Render the filtered movies
        res.render("index.ejs", { movies: filteredMovies, query: req.query, currentDate });
    });
});


app.listen(port, ()=> {
console.log(`Listening to port ${port}`);

})
