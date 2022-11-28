import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
function PublishingBar() {
    const { store } = useContext(GlobalStoreContext);

    async function handleDeleteList() {
        let id = store.currentList._id;
        store.markListForDeletion(id);
    }
    async function handleDuplicate(){
        store.duplicateList();
    }
    async function handlePublish(){
        store.publishList(store.currentList._id);
    }
    const button = {
        color: '#FFC1CC', 
        backgroundColor: 'white', 
        borderColor: '#FFC1CC',
        borderStyle: 'solid',
        borderWidth: '1px',
        margin: '4px',
        '&:hover':{
            color: 'white', 
            backgroundColor: '#FFC1CC', 
            borderColor: 'white',
            borderStyle: 'solid',
            borderWidth: '1px',
        }
    }
    return (
        <div id="publishing-bar">
            <Button 
                sx = {button}
                id='publish-button'
                onClick={handlePublish}
                variant="contained">
                <Typography>Publish</Typography>
            </Button>
            <Button 
                sx = {button}
                id='delete-list-button'
                onClick={handleDeleteList}
                variant="contained">
                <Typography>Delete</Typography>
            </Button>
            <Button 
                sx = {button}
                id='duplicate-button'
                onClick={handleDuplicate}
                variant="contained">
                <Typography>Duplicate</Typography>
            </Button>
        </div>
    )
}

export default PublishingBar;