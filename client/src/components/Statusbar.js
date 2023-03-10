import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { Typography } from '@mui/material'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add';
/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let text ="";
    let statusName = "statusbar";
    let addListName = "add-list"
    if (auth.user !== null) {
        statusName = "statusbar-visible"
    }
    if (store.currentList)
        text = store.currentList.name;

    
    return (
        <div id="playlister-statusbar" className={statusName}>
            <Typography variant="h4">{text}</Typography>
        </div> 
    );
}

export default Statusbar;