let express = require("express");
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
let path = require("path");
let pathfile = path.join(__dirname, "moviesData.db");
let app = express();
app.use(express.json());
let db = null;
let initalizationdbserver = async () => {
  try {
    db = await open({
      filename: pathfile,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error:${error.message}`);
  }
};
initalizationdbserver();
let finalresultfirst = (arrayresult) => {
  return {
    movie_Id: arrayresult.movie_Id,
    director_Id: arrayresult.director_Id,
    movie_name: arrayresult.movie_name,
    lead_actor: arrayresult.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  let getquery = `
  SELECT *
  FROM movie`;
  let arrayresult = await db.all(getquery);
  response.send(finalresultfirst(arrayresult));
});
app.post("/movies/", async (request, response) => {
  let moviedetails = request.body;
  let { directorId, movieName, leaderActor } = moviedetails;
  let postmovie = `
  INSERT INTO
  movie(director_id,movie_name,lead_actor)
  VALUES (${directorId}, `${movieName}`,`${leaderActor}`);`;
  let excute = await db.run(postmovie);
  response.send("Movie Successfully Added");
});
app.get("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;
  let getqueryunique = `
  SELECT *
  FROM movie
  WHERE movie_id=${movieId}
  `;
  let final = await db.get(getqueryunique);
  response.send(final);
});
