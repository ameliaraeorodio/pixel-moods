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
        margin: '50px',
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
            <Box className = 'font-link'
                sx = {{fontSize: '200%', margin: '60px'}}
            > pixel moods</Box>
            <Box className = 'font-link'
                sx = {{fontSize: '40%', marginTop: '120px'}}
            >
                the daily mood tracker to incorperate in your everyday routine
            </Box>
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

                    </Box>
                </div>
        </div>
    )
}