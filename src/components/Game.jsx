import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Board from "./Board";
import "./game.scss";
import Records from "./Records";

const WinnerInfo = ({ showModal, handleClose, time, handleGameSave }) => {
  const name = useRef("");

  const handleSave = () => {
    console.log("name in save:", name.current.value);
    console.log("time:", time);
    const finalName = name.current.value || "Random Player";
    handleGameSave(finalName);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div>
              <label htmlFor="name">Name</label>
              <input name="name" ref={name} />
              <span>If you keep it blank, it will save as "Random Player"</span>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

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

  const [currentLevel, setCurrentLevel] = useState(premadeLevels.expert);
  // const [level, setLevel] = useState("expert");
  const selectedLevel = useRef();
  // const selectedLevel = useRef("beginner");

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [runningTime, setRunningTime] = useState(0);
  const [timer, setTimer] = useState();
  const [finalTime, setFinalTime] = useState();

  useEffect(() => {
    if (gameStarted && !gameOver) {
    } else if (gameOver) {
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (runningTime > 999) {
      setTimer(clearInterval(timer));
    }
    // eslint-disable-next-line
  }, [runningTime]);

  const changeLevel = (event) => {
    // setLevel(selectedLevel.current.value);
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

    const newTimer = setInterval(() => {
      setRunningTime((runningTime) => runningTime + 1);
    }, 1000);
    setTimer(newTimer);
  };

  const clickedBomb = () => {
    setGameOver(true);

    console.log("game into useEffect clear timer", timer);
    setTimer(clearInterval(timer));
    console.log("after clearInterval:", timer);
  };

  const reset = () => {
    setGameStarted(false);
    setGameOver(false);
    setGameComplete(false);
    setRunningTime(0);
    setTimer(clearInterval(timer));
  };

  const completed = () => {
    setGameComplete(true);
    setShowModal(true);
    setGameOver(true);
    setFinalTime(runningTime);

    setTimer(clearInterval(timer));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const gameSave = async (name) => {
    const game = {
      name,
      time: finalTime,
      level: selectedLevel.current.value,
    };
    console.log("game:", game);
    const createdGame = await axios.post(
      `${process.env.REACT_APP_API_URL}/games`,
      game
    );
    console.log("createdGame:", createdGame);
    closeModal();
  };

  return (
    <section className="game">
      <select onChange={changeLevel} ref={selectedLevel}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
      </select>
      <button onClick={reset}>Reset</button>
      <div>Timer: {runningTime}</div>
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
      <Records />
      <WinnerInfo
        showModal={showModal}
        handleClose={closeModal}
        time={finalTime}
        handleGameSave={gameSave}
      />
    </section>
  );
};

export default Game;
