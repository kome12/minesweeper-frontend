import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import "./App.scss";
import Game from "./components/Game";

function App() {
  useEffect(() => {
    document.title = "Minesweeper";
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Minesweeper</h1>
      </header>
      <Game />
    </div>
  );
}

export default App;
