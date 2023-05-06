import React, { useEffect, useState } from "react";
import { 
     TextField,
     Button,
     Snackbar,
     Alert
} from "@mui/material";
import '../App.css';

const CreatePlayer = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [responseCode, setResponseCode] = useState("");
    const [createUserMessage, setCreateUserMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    
    const playerUrl = process.env.REACT_APP_PLAYER_URL;

    const handleSubmit = (event) => {
        event.preventDefault();
        clearErrors();
        setResponseCode("");

        if (name === "") {
            setUsernameError("Username is required");
            return;
        }
        if (password === "") {
            setPasswordError("Password is required");
            return;
        }
        if (confirmPassword === "") {
            setConfirmPasswordError("Confirm Password is required");
            return;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        handleCreatePlayer();
    };

    const clearErrors = () => {
        setUsernameError("");
        setPasswordError("");
        setConfirmPasswordError("");
    }

    const handleCreatePlayer = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password })
        };

        try {
            const response = await fetch(playerUrl, requestOptions);
            const data = await response.json();

            setResponseCode(data.status ? data.status : 201);
        } catch (error) {
            setResponseCode(503);
            setShowAlert(true);
        }
    }

    const getCreateUserMessage = (responseCode) => {
        switch (responseCode) {
            case 201:
            case "":
            case undefined:
                return `User ${name} created successfully`;
            case 409:
                return `User with name ${name} already exists. Please try another name.`;
            case 503:
                return `Connection to server failed.`;
            default:
                return `Something went wrong. Please try again.`;
        }
    }

    const getAlertSeverity = (responseCode) => {
        switch (responseCode) {
            case 201:
            case "":
            case undefined:
                return "success";
            case 409:
                return "error";
            default:
                return "error";
        }
    }

    useEffect(() => {
        setCreateUserMessage(getCreateUserMessage(responseCode));

        if (responseCode !== "") {
           setShowAlert(true); 
        }
    }, [responseCode])

    return (
        <React.Fragment>
            <form autoComplete="off" onSubmit={handleSubmit} className="create-player-form">
                <h2>Create User</h2>
                <TextField
                    label="Username"
                    onChange={(e) => setName(e.target.value)}
                    required
                    variant="outlined"
                    type="text"
                    sx={{ mb: 3 }}
                    fullWidth
                    value={name}
                    className="text-input"
                    size="small"
                    error={usernameError !== ""}
                    helperText={usernameError}
                />
                <TextField
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    variant="outlined"
                    type="password"
                    sx={{ mb: 3 }}
                    fullWidth
                    value={password}
                    className="text-input"
                    size="small"
                    error={passwordError !== ""}
                    helperText={passwordError}
                />
                <TextField
                    label="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    variant="outlined"
                    type="password"
                    sx={{ mb: 3 }}
                    fullWidth
                    value={confirmPassword}
                    className="text-input"
                    size="small"
                    error={confirmPasswordError !== ""}
                    helperText={confirmPasswordError}
                />

                <div className="button-container">
                    <Button variant="outlined" type="submit">
                        Create
                    </Button>
                </div>
            </form>
            <Snackbar open={showAlert} autoHideDuration={5000} onClose={() => setShowAlert(false)}>
                <Alert onClose={() => setShowAlert(false)} 
                        severity={getAlertSeverity(responseCode)} 
                        sx={{ width: '100%' }}>
                    {createUserMessage}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}

export default CreatePlayer;