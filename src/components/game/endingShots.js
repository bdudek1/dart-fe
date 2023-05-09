import React from "react";
import { Typography, Paper, List, ListItem } from '@mui/material';

const EndingShots = ({endingShots}) => {
    return (
        <React.Fragment>
            <Paper className="possible-endings">
                <Typography variant="h5" align="center" color="textPrimary">
                    Possible Endings:
                </Typography>
                <List>
                    {endingShots.map(endingShots => (
                        <ListItem divider dense key={endingShots}><b>{endingShots.replace(/[\[\]]/g, "")}</b></ListItem>
                    ))}
                </List> 
            </Paper>
        </React.Fragment>
    );
}

export default EndingShots;