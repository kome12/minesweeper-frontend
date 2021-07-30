import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Board from "./Board";
import "./game.scss";
import Records from "./Records";

const WinnerInfo = ({ showModal, handleClose, time, handleGameSave }) => {
  const name = useRef("");

  const handleSave = (event) => {
    event.preventDefault();
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
          <form onSubmit={handleSave}>
            <div className="form-separator">
              <label htmlFor="name" className="form-label">
                Enter Name to Save Record
              </label>
              <input
                name="name"
                ref={name}
                placeholder="Random Player"
                autoFocus={true}
                className="form-input"
              />
              <span className="name-warning">
                If you keep it blank, it will save as "Random Player"
              </span>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} type="button">
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleSave}>
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
  const selectedLevel = useRef("expert");
  // const selectedLevel = useRef("beginner");

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [runningTime, setRunningTime] = useState(0);
  const [timer, setTimer] = useState();
  const [finalTime, setFinalTime] = useState();
  const [minesLeft, setMinesLeft] = useState(currentLevel.numMines);

  useEffect(() => {
    if (gameStarted && !gameOver) {
    } else if (gameOver) {
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (runningTime >= 999) {
      setTimer(clearInterval(timer));
    }
    // eslint-disable-next-line
  }, [runningTime]);

  const changeLevel = (event) => {
    // setLevel(selectedLevel.current.value);
    setCurrentLevel(premadeLevels[selectedLevel.current.value]);
    console.log("currentLevel:", currentLevel);
    // setGameStarted(false);
    // setGameComplete(false);
    // setGameOver(false);
    reset();
  };

  const startGame = () => {
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

    setTimer(clearInterval(timer));
  };

  const reset = () => {
    setGameStarted(false);
    setGameOver(false);
    setGameComplete(false);
    setRunningTime(0);
    setTimer(clearInterval(timer));
    setMinesLeft(premadeLevels[selectedLevel.current.value].numMines);
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
    await axios.post(`${process.env.REACT_APP_API_URL}/games`, game);
    closeModal();
  };

  const updateMinesLeft = (currentFlagCount) => {
    const remainingMines = currentLevel.numMines - currentFlagCount;
    setMinesLeft(remainingMines);
  };

  return (
    <div>
      <section className="game">
        <div className="game-controls">
          <Form.Select
            onChange={changeLevel}
            ref={selectedLevel}
            defaultValue="expert"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </Form.Select>
          {/* <button onClick={reset}>Reset</button> */}
          <Button variant="primary" type="button" onClick={reset}>
            Reset
          </Button>
        </div>
        <div>
          <div>Timer: {runningTime}</div>
          <div>Mines Left: {minesLeft}</div>
        </div>
        {/* <select onChange={changeLevel} ref={selectedLevel}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
      </select> */}
        <Board
          currentLevel={currentLevel}
          gameStarted={gameStarted}
          startGame={startGame}
          clickedBomb={clickedBomb}
          gameOver={gameOver}
          gameComplete={gameComplete}
          completedGame={completed}
          updateFlagCount={updateMinesLeft}
        />
      </section>
      <Records />
      <WinnerInfo
        showModal={showModal}
        handleClose={closeModal}
        time={finalTime}
        handleGameSave={gameSave}
      />
    </div>
  );
};

export default Game;
