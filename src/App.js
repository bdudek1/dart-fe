import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar";
import CreateGame from "./components/createGame";
import Players from "./components/players";
import Home from "./components/home";
import PlayersStatistics from "./components/playersStatistics";

const App = () => { 
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" component={Home} />
        <Route exact path="/create-game" component={CreateGame} />
        <Route exact path="/players" component={Players} />
        <Route exact path="/players-statistics" component={PlayersStatistics} />
      </Routes>
    </Router>
  );
}

export default App;
