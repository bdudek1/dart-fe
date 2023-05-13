import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar";
import CreateGame from "./components/createGame";
import Game from "./components/game/game";
import Player from "./components/player";
import Players from "./components/players";
import Home from "./components/home";
import PlayersStatistics from "./components/playersStatistics";
import CreatePlayer from './components/createPlayer';

const App = () => { 
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/player/:playerName" element={<Player />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players-statistics" element={<PlayersStatistics />} />
        <Route path="/create-player" element={<CreatePlayer />} />
      </Routes>
    </Router>
  );
}

export default App;
