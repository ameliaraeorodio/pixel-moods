import { Box } from "@mui/system";
import { Button } from "@mui/material";
import {Link} from "@mui/material";
export default function SplashScreen() {
    const logoStyle = {
        height: '25%',
        width: '25%',
    };
    const buttons = {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: '10px',
        margin: '10px',
    }
    const button = {
        color: 'red', 
        backgroundColor: 'white', 
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: '1px',
        '&:hover':{
            color: 'white', 
            backgroundColor: '#F66A6A', 
            borderColor: 'white',
            borderStyle: 'solid',
            borderWidth: '1px',
        }
    }
    return (
        <div id = "splash-screen">
            <Box component = "img"
                src = "playlister logo.png"
                sx = {logoStyle}
            ></Box>
            <h6 id = "welcome-text">
                Welcome to Playlister!
            </h6>
            <p id= "splash-text">Playlister is a simple yet effective web 
                application where users can create and 
                publish their own playlists. </p>
            <p id = "splash-text">
                The user can 
                choose to create an account or browse the
                 app as a guest.
            </p>
            <div id="login-container">
                    <Box sx = {buttons}>
                        <Button 
                        href = '/register'
                        sx = {button} 
                        variant = "contained"
                            
                        >Create Account
                        </Button>
                        <Button 
                        href = '/login'
                        sx = {button} 
                        variant = "contained"
                            
                        >Log In
                        </Button>
                        <Button 
                        href='/'
                        sx = {button} 
                        variant = "contained"
                            
                        >Continue as Guest
                        </Button>
                    </Box>
                </div>
        </div>
    )
}