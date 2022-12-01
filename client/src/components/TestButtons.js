import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import { IconButton, Typography } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import {Grid} from '@mui/material';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'
import AuthContext from '../auth';
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function TestButtons(props) {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);
    const {id,likes,dislikes} = props;
    function handleLikeList(){
        store.likeList(id, auth.user.userName);
    }
    function handleDislikeList(){
        store.dislikeList(id, auth.user.userName);
    }
    //have to have a prop that checks if its liked or disliked in order to change the icons
    console.log('WHAT ARE LIKES',likes);
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
                            onClick = {handleLikeList}
                        >
                            <ThumbUpOutlinedIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs = {2}><Typography>{likes.length}</Typography></Grid>
                    <Grid item xs={2}>
                        <IconButton sx = {button}
                            onClick = {handleDislikeList}
                        >
                            <ThumbDownAltOutlinedIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs = {2}><Typography>{dislikes.length}</Typography></Grid>
                    <Grid item xs = {2}></Grid>
                    <Grid item xs = {2}></Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs = {2}></Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs = {8}>
                        <Typography sx ={{fontSize:'70%'}}>listens: 123 </Typography>
                    </Grid>
                </Grid>
        </div>
    )
}

export default TestButtons;