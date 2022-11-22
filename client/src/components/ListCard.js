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


/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected, expanded, onChange} = props;

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
            sx={{ width: '100%', bgcolor: 'background.paper'}}
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
        editToolbar = <EditToolbar />;
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
        )
      };
    let cardElement =
    <Accordion
        expanded = {expanded}
        id={idNamePair._id}
        key={idNamePair._id}
        sx={{ marginTop: '15px'}}
        onChange = {onChange}
        onClick = {handleToggleEdit}
    >
        <AccordionSummary
          {...accordionProps}
        >
          <Typography>{idNamePair.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            {songList}{editToolbar}{publishingBar}
        </AccordionDetails>
      </Accordion>

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