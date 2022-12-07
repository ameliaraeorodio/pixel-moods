import React, { useState, useContext, useEffect } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import UserBar from './UserBar'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import YoutubePlaylister from "./YoutubePlaylister.js";
import { TextField } from '@mui/material'
import {Grid} from '@mui/material'
import SongCard from './SongCard'
import CommentCard from './CommentCard'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);
    const [text, setText] = useState("");
    const [value, setValue] = React.useState('Player');
    const [textVal, setTextVal] = useState('add comment');

    const handleChange = (panel) => (event, isExpanded) => {
        console.log("is something expanded: "+isExpanded);
        setExpanded(isExpanded ? panel : false);
        if(!isExpanded){
            store.closeCurrentList();
        }
        else{
            store.setCurrentList(panel);
        }
      };
      function handleComment(event) {
        setText(event.target.value);
        console.log('IN TEXTFIELD: '+text);
    }
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            console.log('who is the current user; '+auth.user.userName);
            store.addComment(text, auth.user.userName)
            
            setText('');
            
        }
    }
    useEffect(() => {
        store.loadIdNamePairs();
    }, []);
    let listCard = "";
    let commentCard = "";
    if(store.currentList){
        commentCard=
        <List sx={{ width: '90%', left: '5%', margin: '5px'}}>
            {
            store.currentList.comments.map((comment,index) => {

                    return <CommentCard
                    key = {index}
                    message = {comment.message}
                    user = {comment.user}
                />
                }   
                )  
            }
        </List>
    }
    //add a timestamp variable here
    let timeCalc = "";
    console.log('store: ',store);
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', margin: '5px'}}>
            {
                store.idNamePairs.map(pair =>{
                    
                    if(pair.published){
                        timeCalc = new Date(pair.updatedAt)
                        return <ListCard
                        sx = {{ marginTop: '7px',backgroundColor:' #9CAF88'}}
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        expanded = {expanded === pair._id} 
                        onChange = {handleChange(pair._id)}
                        timestamp = {timeCalc.toDateString().substring(4)}
                        user = {pair.userName}
                        isPublished = {true}
                        likes = {pair.likes}
                        isLike = {false}
                        isDislike = {false}
                        dislikes = {pair.dislikes}
                    />
                    }
                    return <ListCard
                    sx = {{ marginTop: '7px',backgroundColor:'white'}}
                    key={pair._id}
                    idNamePair={pair}
                    user = {pair.userName}
                    selected={false}
                    expanded = {expanded === pair._id} 
                    onChange = {handleChange(pair._id)}
                    isPublished = {false}
                />
                })
            }
            </List>;
    }
    const handleTabValue = (event, newValue) => {
        setValue(newValue);
      };
    let tabs = 
        <Box sx={{ width: '100%', margin: '10px'}}>
        <Tabs
        value={value}
        onChange={handleTabValue}
        aria-label=""
        >
        <Tab
            value="Player"
            label="Player"
        />
        <Tab value="Comments" label="Comments" />
        </Tabs>
    </Box>
    let playerComments = "";
    if(value == "Player"){
        if(store.currentList){
            playerComments = <Box>
            <YoutubePlaylister/>
        </Box>
        }
    }
    if(value === 'Comments'){
        if(store.currentList){
            playerComments=
            <Grid container spacing={70}>
                <Grid item xs = {10}>
                <div id = 'comment-section'>
                        {commentCard}
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <TextField sx={{width: 700}}
                        size = "small" 
                        label = 'add comment'
                        variant="outlined"
                        onChange = {handleComment}
                        onKeyPress = {handleKeyPress}
                    />
                </Grid>
            </Grid>
        }
    }
    let ytvideo = 
    <Box
    >
        {playerComments}
    </Box>
    return (
        <div id = 'home'>
            <div id = 'userbar'>
                <UserBar/>
            </div>
            
                <div id="list-selector-list">
                    {
                        listCard
                    }
                    <MUIDeleteModal />
                </div>
    
            <div id = 'comment-play-tabs'>
                {tabs}{playerComments}
            </div>
        </div>
        
        )
}

export default HomeScreen;