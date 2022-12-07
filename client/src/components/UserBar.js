import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'



import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { TextField } from '@mui/material';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';


export default function UserBar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [text, setText] = useState("");
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    function handleSortByName(){
        store.loadIdNamePairsByName();
    }
    function handleSortByPublish(){
        store.loadIdNamePairsByPublish()
    }
    function handleSortByLikes(){
        store.loadIdNamePairsByLikes();
    }
    function handleSortByDislikes(){
        store.loadIdNamePairsByDislikes();
    }
    function handleSortByCreation(){
        store.loadIdNamePairsByCreation();
    }
    function handleLoadIdNamePairs(){
        store.loadIdNamePairs();
    }
    function loadPublishedLists(){
        store.loadIdNamePairsPublishedLists();
    }
    function loadPublishedUsers(){
        store.loadIdNamePairsPublishedUsers();
    }
    let searched = "";
    function handleSearch(event) {
        setText(event.target.value);
        console.log('IN TEXTFIELD: '+text);
    }
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if(store.currentLoad === 'lists'){
                console.log('PRESSING ENTER: '+text);
                store.loadIdNamePairsAllLists(text);
            }
            if(store.currentLoad === 'users'){
                console.log('PRESSING ENTER: '+text);
                store.loadIdNamePairsAllUsers(text);
            }
            if(store.currentLoad === null){
                store.loadIdNamePairsCurrentUser(text);
            }
        }
    }
    const logoStyle = {
        height: '10%',
        width: '10%',
    };
    const userIcon = {
        width: '100%', 
        textAlign: 'right',
    }
    const sortBy = 'primary-search-account-menu';
    let sortMenu = "";
    if(store.currentLoad){
        sortMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={sortBy}
            getContentAnchorEl={null}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleSortByName}>Name (A-Z)</MenuItem>
            <MenuItem onClick={handleSortByPublish}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Listens (High - Low)</MenuItem>
            <MenuItem onClick={handleSortByLikes}>Likes (High - Low)</MenuItem>
            <MenuItem onClick={handleSortByDislikes}>Dislikes (High - Low)</MenuItem>
        </Menu>
         );
    }
    else{
        sortMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                id={sortBy}
                getContentAnchorEl={null}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleSortByName}>Name (A-Z)</MenuItem>
                <MenuItem onClick={handleSortByCreation}>Creation Date (Old - New)</MenuItem>
                <MenuItem onClick={handleSortByPublish}>By Last Edit (New - Old)</MenuItem>
            </Menu>
             );
    }
    let menu = sortMenu;
    
    return (
        <Box sx={{ flexGrow: 1}}>

            <AppBar elevation = {0} style={{ background: 'transparent' }} position="static" >
                <Toolbar>
                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="load user's lists"
                            aria-haspopup="true"
                            onClick = {handleLoadIdNamePairs}
                        
                        >
                            <HomeOutlinedIcon sx = {{color: "#990014", fontSize: '120%'}}></HomeOutlinedIcon>
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="load different published lists"
                            aria-haspopup="true"
                            onClick = {loadPublishedLists}
                        >
                            <Groups2OutlinedIcon sx = {{color: "#990014", fontSize: '120%'}}></Groups2OutlinedIcon>
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="load different playlists by user"
                            aria-haspopup="true"
                            onClick = {loadPublishedUsers}
                        >
                            <Person2OutlinedIcon sx = {{color: "#990014", fontSize: '120%'}}></Person2OutlinedIcon>
                        </IconButton>
                    </Box>
                    <Box sx = {{width: "50%", margin: "0 auto"}}>
                        <TextField sx={{width: 600}}
                        size = "small" 
                        onChange = {handleSearch}
                        onKeyPress = {handleKeyPress}
                        id="outlined-basic fullWidth" 
                        label="Search" 
                        variant="outlined"/>
                    </Box>
                    <Typography sx = {{color: "#990014", fontSize: '120%'}}>SORT</Typography>
                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={sortBy}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                        >
                            <SortOutlinedIcon sx = {{color: "#990014", fontSize: '120%'}}></SortOutlinedIcon>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}