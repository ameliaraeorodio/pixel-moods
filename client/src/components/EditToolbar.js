import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
    }
    const button = {
        color: '#FFC1CC', 
        backgroundColor: 'white', 
        borderColor: '#FFC1CC',
        borderStyle: 'solid',
        borderWidth: '1px',
        '&:hover':{
            color: 'white', 
            backgroundColor: '#FFC1CC', 
            borderColor: 'white',
            borderStyle: 'solid',
            borderWidth: '1px',
        }
    }
    return (
        <div id="edit-toolbar">
            <Button
                sx = {button}
                disabled={!store.canAddNewSong()}
                id='add-song-button'
                onClick={handleAddNewSong}
                variant="contained">
                <AddIcon />
            </Button>
            <Button 
                sx = {button}
                disabled={!store.canUndo()}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                sx = {button}
                disabled={!store.canRedo()}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    <RedoIcon />
            </Button>
            <Button
                sx = {button}
                disabled={!store.canClose()}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                    <CloseIcon />
            </Button>
        </div>
    )
}

export default EditToolbar;