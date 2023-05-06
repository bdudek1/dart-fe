import React, { useState } from "react";
import { 
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import '../App.css';

const CreateGame = () => {
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [userName, setUserName] = useState('');
  const [usernameError, setUsernameError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const playerUrl = process.env.REACT_APP_PLAYER_URL;
  const gameUrl = process.env.REACT_APP_GAME_URL;

  const handleAddGuestUser = () => {
    handleEmptyUsernameError();

    if (userName === "") {
      return;
    }

    handleCreateGuestPlayerRequest(userName);
    setUserName('');
  };

  const handleAddRegisteredUser = () => {
    handleEmptyUsernameError();

    if (userName === "") {
      return;
    }

    handleFindRegisteredPlayerRequest(userName);
    setUserName('');
  }

  const handleCreateGame = () => {
    if (users.length < 2) {
      setAlertMessage("At least 2 players are required to create a game.");
      setShowAlert(true);
      return;
    }

    handleCreateGameRequest();
  }

  const handleEmptyUsernameError = () => {
    setUsernameError("");
    if (userName === "") {
      setUsernameError("Please enter a username");
    }
  }

  const handleCreateGuestPlayerRequest = async (name) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    };

    try {
        const response = await fetch(playerUrl, requestOptions);
        const data = await response.json();

        switch (data.status) {
          case 201:
          case undefined:
            addUserIfAbsent(name);
            return;
          case 409:
            const isFoundPlayerGuest = checkIfExistingPlayerIsGuest(name);

            if (isFoundPlayerGuest) {
              addUserIfAbsent(name);
            } else {
              setAlertMessage(`User with name ${name} already exists.`);
              setShowAlert(true);
            }

            return;
          default:
            setAlertMessage("Could not create guest player. Please try again.");
            setShowAlert(true);
          return;
        }

    } catch (error) {
        setAlertMessage("Could not create guest player. Please try again.");
        setShowAlert(true);
    }
}

const handleFindRegisteredPlayerRequest = async (name) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  const response = await fetch(`${playerUrl}?name=${name}`, requestOptions);
  const data = await response.json();

  switch (data.status) {
    case 200:
    case undefined:
      if (data.playerType === "GUEST") {
        setAlertMessage(`Player with name ${name} is a guest player.`);
        setShowAlert(true);
        return;
      }

      addUserIfAbsent(name);
      return;
    case 404:
      setAlertMessage(`Player with name ${name} does not exist.`);
      setShowAlert(true);
      return;
    default:
      setAlertMessage("Could not get registered player. Please try again.");
      setShowAlert(true);
    return;
  }
}

const handleCreateGameRequest = async () => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: convertUsersToJson()
  };

  const response = await fetch(gameUrl, requestOptions);
  const data = await response.json();

  switch (data.status) {
    case 201:
    case undefined:
      //TODO:: redirect to game url
      console.log("redirect to game url...");
      return;
    default:
      setAlertMessage("Could not create game. Please try again.");
      setShowAlert(true);
      return;
  }
}

const checkIfExistingPlayerIsGuest = async (name) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  const response = await fetch(`${playerUrl}?name=${name}`, requestOptions);
  const data = await response.json();

  switch (data.status) {
    case 200:
    case undefined:
      if (data.playerType === "GUEST") {
        return true;
      }

      return false;
    case 404:
      return false;
    default:
      return false;
  }

}

const addUserIfAbsent = (name) => {
  if (users.includes(name)) {
    setAlertMessage(`Player with name ${name} is already added.`);
    setShowAlert(true);
    return;
  }

  setUsers([...users, name]);
}

const removeUser = (name) => {
  const updatedUsers = users.filter(user => user !== name);
  setUsers(updatedUsers);
}

const convertUsersToJson = () => {
  const usersJson = [];
  users.forEach(name => {
    usersJson.push({name: name});
  })

  return JSON.stringify(usersJson);
}


  return (
    <div className="create-game-form">
      <List>
        {users.map((item, index) => (
          <ListItem className="player-list-item" onClick={() => removeUser(item)} key={index}>
            <ListItemText primary={item} />
            <PersonRemoveIcon />
          </ListItem>
        ))}
        <ListItem>
          <TextField label="Username"
                      variant="standard"
                      type="text"
                      size="small"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      error={usernameError !== ""}
                      helperText={usernameError} />
        </ListItem>
        <div className="add-player-button-container">
          <Button size="small"
                    variant="outlined"
                    className="add-player-button"
                    onClick={handleAddGuestUser}>Add Guest Player</Button>
          <Button size="small" 
                    variant="outlined" 
                    className="add-player-button" 
                    onClick={handleAddRegisteredUser}>Add Registered Player</Button>
        </div>
      </List>
      <Button className="add-player-button" onClick={handleCreateGame}>Create Game</Button>
      <Snackbar open={showAlert} autoHideDuration={3000} onClose={() => setShowAlert(false)}>
        <Alert onClose={() => setShowAlert(false)} 
                severity="error"
                sx={{ width: '100%' }}>
                {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CreateGame;