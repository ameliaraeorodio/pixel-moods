import React from 'react';
import YouTube from 'react-youtube';
import {Grid} from '@mui/material'
import { GlobalStoreContext } from '../store'
import { useState, useContext, useEffect } from 'react'
import {Card} from '@mui/material';
import {CardContent} from '@mui/material';
import {Typography} from '@mui/material';
import PlayButtons from './PlayButtons';
import {Box} from '@mui/material';
function YoutubePlaylister() {
    const { store } = useContext(GlobalStoreContext);
    
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let playlist = [];
    let songs = [];
    store.currentList.songs.map((song, index)=>{
        playlist.push(song.youTubeId);
        songs.push(song);
    })

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = 0;

    const playerOptions = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    return <Grid container spacing={3}>
        <Grid item xs = {11}>
        <YouTube
        videoId={playlist[currentSong]}
        opts={playerOptions}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange} />
        </Grid>
        <Grid item xs = {10.5}>
        <Card sx={{ minWidth: 200, bgcolor: '#FEFBEA' }}>
        <CardContent>
          <Typography align= "center" sx={{ fontSize: 20 }} gutterBottom>
            now playing
          </Typography>
          <Typography sx={{fontSize: 16}}>
            playlist: {store.currentList.name}
          </Typography>
          <Typography sx={{fontSize: 16}}>
            song #: {currentSong}
          </Typography>
          <Typography sx={{fontSize: 16}}>
            title: {songs[currentSong].title}
          </Typography>
          <Typography sx={{fontSize: 16}}>
            artist: {songs[currentSong].artist}
          </Typography>
          <Box sx={{display:"flex",
            justifyContent:"center",
            alignItems:"center",
            marginLeft: '60px'
        }}
            >
                <PlayButtons/>
          </Box>
        </CardContent>
      </Card>
        </Grid>
    </Grid>;
}
export default YoutubePlaylister;