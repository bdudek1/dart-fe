import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {  
        Snackbar,
        Alert,
        Typography,
        Grid,
        Paper
    } from '@mui/material';

const Player = () => {
    const playerName = useParams().playerName;
    const playerStatisticsUrl = process.env.REACT_APP_PLAYER_STATISTICS_URL;

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [playerStatistics, setPlayerStatistics] = useState(undefined);

    useEffect(() => {
        fetchPlayerStatistics();
    }, [playerName])

    const fetchPlayerStatistics = async () => {
        try {
            const response = await fetch(`${playerStatisticsUrl}/${playerName}`);
            const data = await response.json();

            switch (data.status) {
                case 200:
                case undefined:
                    setPlayerStatistics(data);
                    break;
                case 404:
                    setAlertMessage(`Player ${playerName} not found`);
                    setShowAlert(true);
                    break;
                default:
                    setAlertMessage(`Could not retrieve ${playerName}'s data from server.`);
                    setShowAlert(true);
            }
        } catch (error) {
            setAlertMessage(`Could not retrieve ${playerName}'s data from server.`);
            setShowAlert(true);
        }
    }


    return (
        <div className="player-container">
            <Typography variant='h4'>
                {playerName}
            </Typography>
            {playerStatistics ?
                <Paper className="player-data-container">
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 3, md: 4 }}>
                        <Grid item xs={4}>
                            <b>Games Played</b>: {playerStatistics.gamesPlayed}
                        </Grid>
                        <Grid item xs={4}>
                            <b>Shots Fired</b>: {playerStatistics.shotsFired}
                        </Grid>
                        <Grid item xs={4}>
                            <b>Games Won %</b>: {playerStatistics.gamesWonPercentage}
                        </Grid>
                        <Grid item xs={4}>
                            <b>Triple 20 Hits %</b>: {playerStatistics.triple20HitsPercentage}
                        </Grid>
                        <Grid item xs={4}>
                            <b>Double 20 Hits %</b>: {playerStatistics.double20HitsPercentage}
                        </Grid>
                        <Grid item xs={4}>
                            <b>Single 20 Hits %</b>: {playerStatistics.single20HitsPercentage}
                        </Grid>
                        <Grid item xs={4}>
                            <b>Single 25 Hits %</b>: {playerStatistics.single25HitsPercentage}
                        </Grid>
                        <Grid item xs={4}>
                            <b>Double 25 Hits %</b>:  {playerStatistics.double25HitsPercentage}
                        </Grid>
                        <Grid item xs={4}>
                            <b>Triple Hits %</b>: {playerStatistics.tripleHitsPercentage}
                        </Grid>
                        <Grid item xs={4}>
                            <b>Double Hits %</b>: {playerStatistics.doubleHitsPercentage}
                        </Grid>
                    </Grid>
                </Paper>
            : null}
            
            <Snackbar open={showAlert} autoHideDuration={5000} onClose={() => setShowAlert(false)}>
                <Alert onClose={() => setShowAlert(false)} 
                        severity="error"
                        sx={{ width: '100%' }}>
                        {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Player;