import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert } from '@mui/material';

const columns = [
  { field: 'playerName', headerName: 'Player Name', width: 135, sortable: false},
  { field: 'gamesPlayed', headerName: 'Games Played', width: 135, sortingOrder: ['desc', null]},
  { field: 'shotsFired', headerName: 'Shots Fired', width: 135, sortingOrder: ['desc', null]},
  { field: 'gamesWonPercentage', headerName: 'Games Won %', width: 135, sortingOrder: ['desc', null]},
  { field: 'triple20HitsPercentage', headerName: 'Triple 20 Hits %', width: 135, sortingOrder: ['desc', null]},
  { field: 'double20HitsPercentage', headerName: 'Double 20 Hits %', width: 135, sortingOrder: ['desc', null]},
  { field: 'single20HitsPercentage', headerName: 'Single 20 Hits %', width: 135, sortingOrder: ['desc', null]},
  { field: 'single25HitsPercentage', headerName: 'Single 25 Hits %', width: 135, sortingOrder: ['desc', null]},
  { field: 'double25HitsPercentage', headerName: 'Double 25 Hits %', width: 135, sortingOrder: ['desc', null]},
  { field: 'doubleHitsPercentage', headerName: 'Double Hits %', width: 135, sortingOrder: ['desc', null]},
  { field: 'tripleHitsPercentage', headerName: 'Triple Hits %', width: 135, sortingOrder: ['desc', null]},
];

const BY_GAMES_PLAYED_SORT = "BY_GAMES_PLAYED";

const sortValuesMap = new Map();
sortValuesMap.set("gamesPlayed", BY_GAMES_PLAYED_SORT);
sortValuesMap.set("shotsFired", "BY_SHOTS_FIRED");
sortValuesMap.set("gamesWonPercentage", "BY_GAMES_WON_PERCENTAGE");
sortValuesMap.set("triple20HitsPercentage", "BY_TRIPLE_20_HITS_PERCENTAGE");
sortValuesMap.set("double20HitsPercentage", "BY_DOUBLE_20_HITS_PERCENTAGE");
sortValuesMap.set("single20HitsPercentage", "BY_SINGLE_20_HITS_PERCENTAGE");
sortValuesMap.set("single25HitsPercentage", "BY_SINGLE_25_HITS_PERCENTAGE");
sortValuesMap.set("double25HitsPercentage", "BY_DOUBLE_25_HITS_PERCENTAGE");
sortValuesMap.set("doubleHitsPercentage", "BY_DOUBLE_HITS_PERCENTAGE");
sortValuesMap.set("tripleHitsPercentage", "BY_TRIPLE_HITS_PERCENTAGE");

const PlayersStatistics = () => {
  const playerStatisticsUrl = process.env.REACT_APP_PLAYER_STATISTICS_URL;
  const PAGE_SIZE = 10;
  const [sortType, setSortType] = useState(BY_GAMES_PLAYED_SORT);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchPlayersStatistics();
  }, [sortType, page]);

  useEffect(() => {
    if (rows.length > 9) {
      setRowsCount((page + 1) *  PAGE_SIZE + 1);
    } else {
      setRowsCount((page) *  PAGE_SIZE + rows.length);
    }
  }, [rows])

  const handleSortModelChange = useCallback((sortOptions) => {
    if (sortOptions[0]) {
      setSortType(sortValuesMap.get(sortOptions[0].field));
    } else {
      setSortType(BY_GAMES_PLAYED_SORT);
    }
    
  }, []);

  const fetchPlayersStatistics = async () => {

    try {
      setIsLoading(true);
      const response = await fetch(`${playerStatisticsUrl}?orderType=${sortType}&page=${page + 1}`);
      const data = await response.json();

      switch (data.status) {
        case 200:
        case undefined:
          setRows(data);
          return;
        default:
          setAlertMessage("There is a problem with retrieving data from the server.");
          setShowAlert(true);
        }
      } catch (error) {
          setAlertMessage("Could not connect to server. Please try again.");
          setShowAlert(true);
      } finally {
          setIsLoading(false);
      }
    
  }

  return (
    <div className="player-statistics-container">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: page, pageSize: PAGE_SIZE },
          },
        }}
        pageSizeOptions={[PAGE_SIZE]}
        disableColumnMenu
        paginationMode='server'
        sortingMode='server'
        onSortModelChange={handleSortModelChange}
        onPaginationModelChange={(paginationModel) => setPage(paginationModel.page)}
        hideFooterSelectedRowCount
        loading={isLoading}
        getRowId={(row) => row.playerName}
        rowCount={rowsCount}
        density='compact'
      />

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

export default PlayersStatistics;