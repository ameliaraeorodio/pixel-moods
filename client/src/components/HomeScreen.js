import React, { useState, useContext, useEffect } from 'react'
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

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [expanded, setExpanded] = useState(false);

    const [value, setValue] = React.useState('Player');

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
    useEffect(() => {
        store.loadIdNamePairs();
    }, []);
    let listCard = "";

    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', margin: '10px'}}>
            {
                store.idNamePairs.map(pair =>{
                    if(pair.published){
                        return <ListCard
                        sx = {{ marginTop: '10px',backgroundColor:'#4E9152'}}
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        expanded = {expanded === pair._id} 
                        onChange = {handleChange(pair._id)}
                        
                    />
                    }
                    return <ListCard
                    sx = {{ marginTop: '20px',backgroundColor:'white'}}
                    key={pair._id}
                    idNamePair={pair}
                    selected={false}
                    expanded = {expanded === pair._id} 
                    onChange = {handleChange(pair._id)}
                    
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
                {tabs}
            </div>
        </div>
        
        )
}

export default HomeScreen;