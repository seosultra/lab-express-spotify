require("dotenv").config();

const { Router } = require("express");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

// Retrieve an access token
const spotifyApi = new SpotifyWebApi({
  clientId: "328ba32ef7bf45d886eb3597b56b1d34",
  clientSecret: "119857265d8c4ca69f8afb9ca5b80483",
});

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});
app.get("/artist-search", (req, res, next) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      res.render("artist-search-results", {
        artistsFound: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:id", (req, res, next) => {
  const { id } = req.params;

  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      const artist = data.body.items[0].artists[0].name;

      res.render("album", { artist, album: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/tracks/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi.getAlbumTracks(id).then((data) => {
    console.log(data.body);
    const tracks = data.body.items;
    res.render("tracks", { tracks });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
