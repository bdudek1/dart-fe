import React, { useEffect, useState } from "react";
import { Table,
          TableBody,
          TableCell,
          TableContainer,
          TableHead,
          TableRow,
          Paper,
          Snackbar,
          Alert,
          IconButton,
          TextField } from '@mui/material'
import SearchIcon from "@mui/icons-material/Search";

const Players = () => {
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filterUsers = (query, users) => {
    if (!query) {
      return users;
    } else {
      return users.filter((d) => d.name.toLowerCase().includes(query));
    }
  };

  return (
    <div className="players-table-container">
    <React.Fragment>
      <TextField
        id="search-bar"
        className="text"
        onInput={(e) => {
          setSearchQuery(e.target.value);
        }}
        label="Enter a player name"
        variant="outlined"
        placeholder="Search..."
        size="small"
        value={searchQuery}
      />
      <IconButton>
        <SearchIcon style={{ fill: "blue" }} />
      </IconButton>
    </React.Fragment>
      <TableContainer component={Paper} sx={{ height: 600, marginTop: 2}}>
        <Table stickyHeader sx={{ minWidth: 650, height: "max-content" }}>
          <TableHead>
            <TableRow>
              <TableCell><b>Player ID</b></TableCell>
              <TableCell align="left"><b>Player Name</b></TableCell>
              <TableCell align="left"><b>Player Type</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterUsers(searchQuery, users).map((row) => (
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