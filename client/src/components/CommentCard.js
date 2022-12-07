import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { Card } from '@mui/material';
import {CardContent} from '@mui/material';
import {Typography} from '@mui/material';
function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { message, user } = props;

    let cardClass = "list-card unselected-list-card";
    return (
        <Card sx={{ minWidth: 275, marginBottom: '20px' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            {user}
          </Typography>
          <Typography sx={{fontSize: 20}}>
            {message}
          </Typography>
        </CardContent>
      </Card>
    );
}

export default CommentCard;