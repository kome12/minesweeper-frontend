import { useRef, useState } from "react";
import Board from "./Board";
import "./game.scss";

const Game = () => {
  const premadeLevels = {
    beginner: {
      height: 9,
      width: 9,
      numMines: 10,
    },
    intermediate: {
      height: 16,
      width: 16,
      numMines: 40,
    },
    expert: {
      height: 16,
      width: 30,
      numMines: 99,
    },
  };

  const [currentLevel, setCurrentLevel] = useState(premadeLevels.beginner);
  // const selectedLevel = useRef("expert");
  const selectedLevel = useRef("beginner");

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const changeLevel = (event) => {
    setCurrentLevel(premadeLevels[selectedLevel.current.value]);
    setGameStarted(false);
    setGameComplete(false);
    setGameOver(false);
  };

  const startGame = () => {
    console.log("caem into startGame");
    setGameStarted(true);
    setGameComplete(false);
    setGameOver(false);
  };

  const clickedBomb = () => {
    setGameOver(true);
  };

  const reset = () => {
    setGameStarted(false);
    setGameOver(false);
    setGameComplete(false);
  };

  const completed = () => {
    setGameComplete(true);
  };

  return (
    <section className="game">
      <p>{gameStarted ? "Game has started" : "Game not started"}</p>
      <select onChange={changeLevel} ref={selectedLevel}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
      </select>
      <button onClick={reset}>Reset</button>
      gameComplete: {gameComplete.toString()}
      {gameComplete ? <h3>CONGRATULATIONS</h3> : null}
      {gameOver ? <h3>GAME OVER!</h3> : null}
      <Board
        currentLevel={currentLevel}
        gameStarted={gameStarted}
        startGame={startGame}
        clickedBomb={clickedBomb}
        gameOver={gameOver}
        gameComplete={gameComplete}
        completedGame={completed}
        // resetGame={reset}
      />
    </section>
  );
};

export default Game;
