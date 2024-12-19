import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import fs from "fs"


const app = express();
const port = 3000;


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

        console.log(moviesData);

       
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
        console.log(moviesData);

        // Use string comparison for imdbID
        const movie = moviesData.find((m) => m.imdbID === req.params.imdbID);
        
        if (movie) {
            res.render("view.ejs", { movie , currentDate}); // Pass movie directly to the view
        } else {
            res.status(404).send('Movie not found'); // Handle movie not found case
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

    console.log(movieName);
    console.log(genre);
    console.log(description);


    res.render("new.ejs", {movies:movies, currentDate})
    
})



app.listen(port, ()=> {
console.log(`Listening to port ${port}`);

})
