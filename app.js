require('dotenv').config();

const { Router } = require('express');
const express = require('express');
const hbs = require('hbs');
const router = require("express").Router();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
//--home page--
app.get('/', (req, res, next) => {
  res.render('home.hbs')
})

//--artist-search--
app.get('/artist-search', (req,res, next) => {
  // console.log(req.query)

  spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    // console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results.hbs', {artists: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

//----Albums------//
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(album => {
    console.log('The received data from the API: ', album.body.items)
    res.render('albums.hbs', {albums:album.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});


//---tracks-----//
app.get('/tracks/:trackId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.trackId)
  .then(track => {
    // console.log('The received data from the API: ', track.body.items)
    res.render('tracks.hbs', {tracks:track.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
