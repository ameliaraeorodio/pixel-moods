import React from 'react';
import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SongCard from './SongCard.js'
import List from '@mui/material/List';
import EditToolbar from './EditToolbar'
import PublishingBar from './PublishingBar';
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import { Box } from '@mui/system';
import AuthContext from '../auth';
import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected, expanded, onChange,sx, isPublished, timestamp} = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    function handleToggleEdit(event) {
        if(event.detail === 2){
            event.stopPropagation();
            console.log('HANDLE EDIT');
            toggleEdit();
        }
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }


    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let songList = "";
    let editToolbar = "";
    let publishingBar = "";
    
    if (store.currentList) {
        songList = <List 
            id="playlist-cards" 
            sx={{sx}}
        >
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
                
            }
         </List>; 
        if(!store.currentList.published){
            editToolbar = <EditToolbar />;
        }     
        publishingBar = <PublishingBar/>;
    }
    const accordionProps = {
        sx: {
          pointerEvents: "none"
          
        },
        expandIcon: (
          <ExpandMoreIcon
            sx={{
              pointerEvents: "auto"
            }}
          />
        ),
      };
    //getting the username will have to change since we are accessing multiple
    //people but this will have to do for now
    let username = "";
    if(auth.user){
        username = auth.getUserName()
    }
    //background color is what would cahnge when u check published/unpublished
   
    let cardElement ="";
    if(idNamePair.published){
        cardElement =
        <Accordion
        expanded = {expanded}
        id={idNamePair._id}
        key={idNamePair._id}
        style={sx}
        onChange = {onChange}
    >
        <AccordionSummary
          {...accordionProps}
        >
            <Box>
                <Typography sx = {{fontSize: '150%'}}>{idNamePair.name}</Typography>
                <Typography>By: {username}</Typography>
                <Typography sx = {{fontSize: '70%'}}>Published: {timestamp}</Typography>
                
            </Box>
            <Box sx={{ flexGrow: 1, paddingLeft: '40%'}}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                    <ThumbUpOutlinedIcon sx = {{fontSize:'170%'}}></ThumbUpOutlinedIcon>
                    </Grid>
                    <Grid item xs = {2}></Grid>
                    <Grid item xs={2}>
                    <ThumbDownAltOutlinedIcon sx = {{fontSize:'170%'}}></ThumbDownAltOutlinedIcon>
                    </Grid>
                    <Grid item xs = {2}></Grid>
                    <Grid item xs = {2}></Grid>
                    <Grid item xs = {2}></Grid>
                    <Grid item xs={2}>
                    <Typography>000</Typography>
                    </Grid>
                    <Grid item xs = {2}></Grid>
                    <Grid item xs={2}>
                    <Typography>000</Typography>
                    </Grid>
                    <Grid item xs = {8}>
                        <Typography sx ={{fontSize:'70%'}}>listens: 123 </Typography>
                    </Grid>
                </Grid>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
            {songList}{editToolbar}{publishingBar}
        </AccordionDetails>
      </Accordion>
    }
    else{
        cardElement = 
        <Accordion
        expanded = {expanded}
        id={idNamePair._id}
        key={idNamePair._id}
        style={sx}
        onChange = {onChange}
        onClick = {handleToggleEdit}
    >
        <AccordionSummary
          {...accordionProps}
        >
            <Box>
                <Typography sx = {{fontSize: '150%'}}>{idNamePair.name}</Typography>
                <Typography>By: {username}</Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
            {songList}{editToolbar}{publishingBar}
        </AccordionDetails>
      </Accordion>
    }

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 18}}}
                InputLabelProps={{style: {fontSize: 18}}}
                autoFocus
            />
    }
    return (
        <Box>
            {cardElement}
            {modalJSX}
        </Box>
    );
}

export default ListCard;