import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED

//HAVE TO ADD SORT BY LISTENS
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    PUBLISH_LIST: "PUBLISH_LIST",
    LOAD_ID_NAME_PAIRS_BY_NAME:"LOAD_ID_NAME_PAIRS_BY_NAME",
    LOAD_ID_NAME_PAIRS_BY_PUBLISHED:"LOAD_ID_NAME_PAIRS_BY_PUBLISHED",
    LOAD_ID_NAME_PAIRS_BY_LIKES:"LOAD_ID_NAME_PAIRS_BY_LIKES",
    LOAD_ID_NAME_PAIRS_BY_DISLIKES: "LOAD_ID_NAME_PAIRS_BY_DISLIKES",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}
const CurrentSort = {
    NONE: 'NONE',
    NAME: 'NAME',
    PUBLISH: 'PUBLISH',
    LISTENS: 'LISTENS',
    LIKES: 'LIKES',
    DISLIKES: 'DISLIKES'
}
// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {

     // HANDLE KEY PRESSES. UNDO IF CTRL+Z, REDO IF CTRL+Y
     const handleKeyPress = useCallback((event) => {
        if (event.ctrlKey) {
            if (event.key === 'z') {
                store.undo()
            }
            if (event.key === 'y') {
                store.redo()
            }
        }
    }, []);

    useEffect(() => {
        // ATTACH THE EVENT LISTENER
        document.addEventListener('keydown', handleKeyPress);

        // REMOVE THE EVENT LISTENER
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentSort: CurrentSort.NONE
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log(type);
        console.log(payload);
        console.log(store.currentModal);
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: store.currentSort
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: store.currentSort
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: store.currentSort
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: CurrentSort.NONE
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    currentSort: store.currentSort
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: store.currentSort
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: store.currentSort
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: store.currentSort
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: store.currentSort
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: store.currentSort
                });
            }
            case GlobalStoreActionType.PUBLISH_LIST:{
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: store.currentSort
                });
            }
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS_BY_NAME:{
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: CurrentSort.NAME
                });
            }
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS_BY_PUBLISHED:{
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: CurrentSort.PUBLISH
                });
            }
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS_BY_LIKES:{
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: CurrentSort.LIKES
                });
            }
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS_BY_DISLIKES:{
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentSort: CurrentSort.DISLIKES
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                if(store.isSortByName()){
                                    console.log('are we in the if statement');
                                    store.loadIdNamePairsByName();
                                    pairsArray = store.idNamePairs;
                                }
                                else if(store.isSortByPublish()){
                
                                }
                                else if(store.isSortByListens()){
                    
                                }
                                else if(store.isSortByLikes()){
                    
                                }
                                else if(store.isSortByDislikes()){
                    
                                }
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.userName, false,[],[]);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newList._id);
            if(store.isSortByName()){
                store.loadIdNamePairsByName();
            }
            else if(store.isSortByPublish()){
                
            }
            else if(store.isSortByListens()){

            }
            else if(store.isSortByLikes()){

            }
            else if(store.isSortByDislikes()){

            }
            else{
                store.loadIdNamePairs();
            }
            console.log("TIME CREATED"+ newList.createdAt);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }
    store.duplicateList = async function (){
        let newListName = "COPY: " + store.currentList.name;
        const response = await api.createPlaylist(newListName, store.currentList.songs, auth.user.email, auth.user.userName, false,[],[]);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newList._id);
            if(store.isSortByName()){
                store.loadIdNamePairsByName();
            }
            else if(store.isSortByPublish()){
                
            }
            else if(store.isSortByListens()){

            }
            else if(store.isSortByLikes()){

            }
            else if(store.isSortByDislikes()){

            }
            else{
                store.loadIdNamePairs();
            }
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }
    store.likeList = async function(id, userName){
        //inserts the name of the user into the array for the list at the given id
        //check if the name is in the likes already
        async function asyncLikeList(id) {
            console.log("CURRENT LIST: ",store.currentList);
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                console.log('POOPusername: '+userName);
                let playlist = response.data.playlist;
                if(!playlist.likes.includes(userName)){
                    if(playlist.dislikes.includes(userName)){
                        const index = playlist.dislikes.indexOf(userName);
                        playlist.dislikes.splice(index);
                    }
                    playlist.likes.push(userName);
                }else{
                    const index = playlist.likes.indexOf(userName);
                    playlist.likes.splice(index)
                }
                console.log('likes: ',playlist);
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                if(store.isSortByName()){
                                    console.log('are we in the if statement');
                                    store.loadIdNamePairsByName();
                                    pairsArray = store.idNamePairs;
                                }
                                else if(store.isSortByPublish()){
                
                                }
                                else if(store.isSortByListens()){
                    
                                }
                                else if(store.isSortByLikes()){
                    
                                }
                                else if(store.isSortByDislikes()){
                    
                                }
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                console.log('number of likes AFTER: '+playlist.likes.length);
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncLikeList(id);
    }
    store.dislikeList = async function (id,userName){
        async function asyncDislikeList(id) {
            console.log("CURRENT LIST: ",store.currentList);
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                console.log('POOPusername: '+userName);
                let playlist = response.data.playlist;
                if(!playlist.dislikes.includes(userName)){
                    if(playlist.likes.includes(userName)){
                        const index = playlist.likes.indexOf(userName);
                        playlist.likes.splice(index);
                    }
                    playlist.dislikes.push(userName);
                }
                else{
                    const index = playlist.dislikes.indexOf(userName);
                    playlist.dislikes.splice(index);
                }
                console.log('likes: ',playlist);
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                if(store.isSortByName()){
                                    console.log('are we in the if statement');
                                    store.loadIdNamePairsByName();
                                    pairsArray = store.idNamePairs;
                                }
                                else if(store.isSortByPublish()){
                
                                }
                                else if(store.isSortByListens()){
                    
                                }
                                else if(store.isSortByLikes()){
                    
                                }
                                else if(store.isSortByDislikes()){
                    
                                }
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                console.log('number of likes AFTER: '+playlist.likes.length);
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncDislikeList(id);
    }
    store.publishList = async function (id){
        async function asyncPublishList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.published = true;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                console.log('HELLO WHAT IS IS SORT BY NAME: '+store.isSortByName());
                                if(store.isSortByName()){
                                    console.log('are we in the if statement');
                                    store.loadIdNamePairsByName();
                                    pairsArray = store.idNamePairs;
                                }
                                else if(store.isSortByPublish()){
                
                                }
                                else if(store.isSortByListens()){
                    
                                }
                                else if(store.isSortByLikes()){
                    
                                }
                                else if(store.isSortByDislikes()){
                    
                                }
                                storeReducer({
                                    type: GlobalStoreActionType.PUBLISH_LIST,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncPublishList(id);
    }
    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }
    store.loadIdNamePairsByName = function(){
        async function asyncLoadByName() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                //right here is where we sort the names
                console.log('what is pairsArray: ', pairsArray);
                for(let i = 1; i< pairsArray.length;i++){
                    for(let j = i - 1; j>-1;j--){
                        if(pairsArray[j+1].name<pairsArray[j].name){
                            [pairsArray[j+1],pairsArray[j]] = [pairsArray[j],pairsArray[j+1]]
                        }
                    }
                }
                console.log('NEW PAIRSARRAY: ',pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS_BY_NAME,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadByName();
    }
    store.loadIdNamePairsByPublish = function(){
        async function asyncLoadByPublish() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = pairsArray.filter(song => song.published===true);
                //right here is where we sort the names
                console.log('what is pairsArray: ', pairsArray);
                for(let i = 1; i< pairsArray.length;i++){
                    for(let j = i - 1; j>-1;j--){
                        if(pairsArray[j+1].updatedAt<pairsArray[j].updatedAt){
                            [pairsArray[j+1],pairsArray[j]] = [pairsArray[j],pairsArray[j+1]]
                        }
                    }
                }
                console.log('NEW PAIRSARRAY: ',pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS_BY_PUBLISHED,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadByPublish();
    }
    store.loadIdNamePairsByLikes = function(){
        async function asyncLoadByLikes() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = pairsArray.filter(song => song.published===true);
                //right here is where we sort the names
                console.log('what is pairsArray: ', pairsArray);
                for(let i = 1; i< pairsArray.length;i++){
                    for(let j = i - 1; j>-1;j--){
                        if(pairsArray[j+1].likes>pairsArray[j].likes){
                            [pairsArray[j+1],pairsArray[j]] = [pairsArray[j],pairsArray[j+1]]
                        }
                    }
                }
                console.log('NEW PAIRSARRAY: ',pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS_BY_LIKES,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadByLikes();
    }
    store.loadIdNamePairsByDislikes = function(){
        async function asyncLoadByDislikes() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = pairsArray.filter(song => song.published===true);
                //right here is where we sort the names
                console.log('what is pairsArray: ', pairsArray);
                for(let i = 1; i< pairsArray.length;i++){
                    for(let j = i - 1; j>-1;j--){
                        if(pairsArray[j+1].dislikes>pairsArray[j].dislikes){
                            [pairsArray[j+1],pairsArray[j]] = [pairsArray[j],pairsArray[j+1]]
                        }
                    }
                }
                console.log('NEW PAIRSARRAY: ',pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS_BY_PUBLISHED,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadByDislikes();
    }
    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                if(store.isSortByName()){
                    store.loadIdNamePairsByName();
                }
                else if(store.isSortByPublish()){
                    
                }
                else if(store.isSortByListens()){
    
                }
                else if(store.isSortByLikes()){
    
                }
                else if(store.isSortByDislikes()){
    
                }
                else{
                    store.loadIdNamePairs();
                }
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        if(store.isSortByName()){
            store.loadIdNamePairsByName();
        }
        else if(store.isSortByPublish()){
            
        }
        else if(store.isSortByListens()){

        }
        else if(store.isSortByLikes()){

        }
        else if(store.isSortByDislikes()){

        }
        else{
            store.loadIdNamePairs();
        }
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        console.log('we are open?: ' + store.currentModal === CurrentModal.REMOVE_SONG);
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }
    store.isSortByName = () =>{
        return store.currentSort === CurrentSort.NAME;
    }
    store.isSortByPublish = () =>{
        return store.currentSort === CurrentSort.PUBLISH;
    }
    store.isSortByListens = () =>{
        return store.currentSort === CurrentSort.LISTENS;
    }
    store.isSortByLikes = () =>{
        return store.currentSort === CurrentSort.LIKES;
    }
    store.isSortByDislikes = () =>{
        return store.currentSort === CurrentSort.DISLIKES;
    }
    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    //history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        if (store.currentModal === CurrentModal.NONE)
            tps.undoTransaction();
    }
    store.redo = function () {
        if (store.currentModal === CurrentModal.NONE)
            tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return ((store.currentList !== null) && store.currentModal === CurrentModal.NONE);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo() && store.currentModal === CurrentModal.NONE);
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo() && store.currentModal === CurrentModal.NONE);
    }
    store.canClose = function() {
        return ((store.currentList !== null) && store.currentModal === CurrentModal.NONE);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };