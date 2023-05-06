import React, { useEffect, useState } from "react";
import { Table,
          TableBody,
          TableCell,
          TableContainer,
          TableHead,
          TableRow,
          Paper,
          Snackbar,
          Alert } from '@mui/material'

const Players = () => {
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const playersUrl = process.env.REACT_APP_PLAYERS_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };

    try {
      const response = await fetch(playersUrl, requestOptions);
      const data = await response.json();

      setUsers(data);
    } catch (error) {
      setShowAlert(true);
    }

  }

  return (
    <div className="players-table-container">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><b>Player ID</b></TableCell>
              <TableCell align="left"><b>Player Name</b></TableCell>
              <TableCell align="left"><b>Player Type</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.playerType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </TableContainer>

    <Snackbar open={showAlert} autoHideDuration={5000} onClose={() => setShowAlert(false)}>
      <Alert onClose={() => setShowAlert(false)} 
              severity="error"
              sx={{ width: '100%' }}>
              There is a problem with retrieving players from server.
      </Alert>
    </Snackbar>
  </div>

  );
}

export default Players;