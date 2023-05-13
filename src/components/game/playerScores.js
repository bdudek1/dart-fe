import React from "react";
import { Typography, Paper } from '@mui/material';

const PlayerScores = ({playerScores}) => {
    return (
        <React.Fragment>
            <Paper elevation="3" className="player-scores">
                {Object.entries(playerScores).map(([name, score]) => (
                    <Typography key={name} gutterBottom variant="subtitle1" align="center" color="textPrimary">
                        Player <b>{name}</b> score: <b>{score}</b>
                    </Typography>
                ))} 
            </Paper>
        </React.Fragment>
    )
}

export default PlayerScores;