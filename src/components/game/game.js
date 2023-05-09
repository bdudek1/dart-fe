import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { 
    Typography,
    Container,
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    DialogActions,
    Backdrop,
    Snackbar,
    Alert
} from '@mui/material';
import PlayerScores from "./playerScores";
import EndingShots from "./endingShots";

const Game = () => {
    const gameId = useParams().gameId;
    const [game, setGame] = useState({});
    const [showNextTurnDialog, setShowNextTurnDialog] = useState(false);
    const [showWinnerDialog, setShowWinnerDialog] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const gameUrl = process.env.REACT_APP_GAME_URL;

    useEffect(() => {
        fetchGameState();
    }, [])

    useEffect(() => {
        if (game.currentPlayer) {
            setShowNextTurnDialog(true);
        }
    }, [game.currentPlayer])

    useEffect(() => {
        if (game.winner) {
            setShowWinnerDialog(true);
        }
    }, [game.winner])

    const fetchGameState = async () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          };

        try {
            const response = await fetch(`${gameUrl}/${gameId}`, requestOptions);
            const data = await response.json();
    
            switch (data.status)  {
                case 200:
                case "":
                case undefined:
                    setGame(data);
                    break;
                case 404:
                    setAlertMessage(`Game of id ${gameId} not found`);
                    setShowAlert(true);
                    break;
                default:
                    setAlertMessage(`Could not connect to the server. Please try again.`);
                    setShowAlert(true);
            }
        } catch (error) {
            setShowAlert(true);
        }
    }

    const performShot = async (score, shotType) => {
        if (game.winner) {
            setShowWinnerDialog(true);
            return;
        }

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score, shotType })
          };

        try {
            const response = await fetch(`${gameUrl}/${gameId}/shot`, requestOptions);
            const data = await response.json();
    
            switch (data.status)  {
                case 200:
                case "":
                case undefined:
                    setGame(data);
                    break;
                case 400:
                    setShowWinnerDialog(true);
                    break;
                case 404:
                    setAlertMessage(`Game of id ${gameId} not found`);
                    setShowAlert(true);
                    break;
                default:
                    setAlertMessage(`Could not connect to the server. Please try again.`);
                    setShowAlert(true);
            }
        } catch (error) {
            setShowAlert(true);
        }

    }

    return (
        <div className="game-container">
            <Container maxWidth="sm">
                <Typography variant="h5" align="center" color="textPrimary">
                    Game State: <b>{game.gameState}</b>
                </Typography>
                { game.currentPlayer ? 
                    <Typography variant="h5" align="center" color="textPrimary">
                        Current Player: <b>{game.currentPlayer}</b>
                    </Typography>
                : null}

                { game.playerScoresMap ? <PlayerScores playerScores={game.playerScoresMap} />  : null}

                {Array.from({ length: 20 }).map((_, index) => 
                    <ButtonGroup className="shot-button-group" key={index} variant="contained" aria-label={`button group ${index + 1}`}>
                        <Button size="small" onClick={() => performShot(index + 1, 'SINGLE')}>{index + 1}</Button>
                        <Button size="small" color="success" onClick={() => performShot(index + 1, 'DOUBLE')}>x2</Button>
                        <Button size="small" color="error" onClick={() => performShot(index + 1, 'TRIPLE')}>x3</Button>
                    </ButtonGroup>
                )}
                <ButtonGroup className="shot-button-group" key={25} variant="contained" aria-label={`button group 25`}>
                    <Button size="small" onClick={() => performShot(25, 'SINGLE')}>{25}</Button>
                    <Button size="small" color="success" onClick={() => performShot(25, 'DOUBLE')}>x2</Button>
                    <Button size="small" onClick={() => performShot(1, 'MISS')}>Miss</Button>
                </ButtonGroup>

                { game.possibleEndingShots && game.possibleEndingShots.length > 0 ? 
                    <EndingShots endingShots={game.possibleEndingShots} />
                : null}

                { game.winner ? 
                    <Typography variant="h5" align="center" color="textPrimary">
                        Winner: {game.winner}
                    </Typography>
                : null}

                <Dialog open={showNextTurnDialog} onClose={() => setShowNextTurnDialog(false)} title="Next Turn">
                    <DialogContent>
                        <p>It's {game.currentPlayer}'s turn</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowNextTurnDialog(false)}>Ok</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showWinnerDialog} onClose={() => setShowWinnerDialog(false)} title="Winner">
                    <DialogContent>
                        <p>{game.winner} has won the game!</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowWinnerDialog(false)}>Ok</Button>
                    </DialogActions>
                </Dialog>

                <Backdrop open={showNextTurnDialog || showWinnerDialog} color="rgba(0, 0, 0, 0.5)" zIndex={10} />

                <Snackbar open={showAlert} autoHideDuration={3000} onClose={() => setShowAlert(false)}>
                    <Alert onClose={() => setShowAlert(false)} 
                            severity="error"
                            sx={{ width: '100%' }}>
                            {alertMessage}
                    </Alert>
                </Snackbar>

            </Container>
        </div>
    );
}

export default Game;