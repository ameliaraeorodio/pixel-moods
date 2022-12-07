import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import { IconButton, Typography } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import {Grid} from '@mui/material';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'
import AuthContext from '../auth';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function PlayButtons(props) {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    //have to have a prop that checks if its liked or disliked in order to change the icons

    const button = {
        pointerEvents: 'auto' ,
        fontSize: '170%',
        color: 'black',
        "&:hover": { backgroundColor: "##9CAB88" } 
    }
    return (
        <div id="edit-toolbar">
            <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <IconButton
                        sx = {button}
                            
                        >
                            <FastRewindIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton sx = {button}
                            
                        >
                            <StopIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton sx = {button}
                            
                        >
                            <PlayArrowIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton sx = {button}
                            
                        >
                            <FastForwardIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
        </div>
    )
}

export default PlayButtons;