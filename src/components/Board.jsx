import { useEffect, useState } from "react";
import "./board.scss";
import Cell from "./Cell";

const Board = ({ currentLevel, gameStarted, startGame, clickedBomb }) => {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    console.log("came into useEffect");
    if (!gameStarted) {
      const newBoard = [];
      for (let r = 0; r < currentLevel.height; r++) {
        const newRow = [];
        for (let c = 0; c < currentLevel.width; c++) {
          newRow.push({
            row: r,
            column: c,
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            isUnknown: false,
            value: 0,
          });
        }
        newBoard.push(newRow);
      }
      setBoard(newBoard);
    }
  }, [currentLevel, gameStarted]);

  const randomizeMinesInBoard = () => {
    const randomRow = Math.floor(Math.random() * currentLevel.height);
    const randomColumn = Math.floor(Math.random() * currentLevel.width);
    return {
      row: randomRow,
      column: randomColumn,
    };
  };

  const initializeBoardWithMines = (initialCell) => {
    let numMines = 0;
    console.log(`initialCell is ${initialCell.row}, ${initialCell.column}`);
    while (numMines < currentLevel.numMines) {
      const randomCoordinate = randomizeMinesInBoard();
      if (
        !(
          initialCell.row === randomCoordinate.row &&
          initialCell.column === randomCoordinate.column
        ) &&
        !board[randomCoordinate.row][randomCoordinate.column].isMine
      ) {
        board[randomCoordinate.row][randomCoordinate.column].isMine = true;
        console.log(
          `mine #${numMines + 1} is on ${randomCoordinate.row}, ${
            randomCoordinate.column
          }`
        );
        numMines++;
      }
    }
  };

  const getSurroundingCells = (cell, currentBoard = board) => {
    const cells = [];
    const row = cell.row;
    const column = cell.column;
    // above
    if (row - 1 >= 0) {
      // top left
      if (column - 1 >= 0) {
        const topLeft = currentBoard[row - 1][column - 1];
        cells.push(topLeft);
      }
      // top
      const top = currentBoard[row - 1][column];
      cells.push(top);
      // top right
      if (column + 1 < currentLevel.width) {
        const topRight = currentBoard[row - 1][column + 1];
        cells.push(topRight);
      }
    }
    // below
    if (row + 1 < currentLevel.height) {
      // bottom left
      if (column - 1 >= 0) {
        const bottomLeft = currentBoard[row + 1][column - 1];
        cells.push(bottomLeft);
      }
      // bottom
      const bottom = currentBoard[row + 1][column];
      if (!bottom.isRevealed) {
        cells.push(bottom);
      }
      // bottom right
      if (column + 1 < currentLevel.width) {
        const bottomRight = currentBoard[row + 1][column + 1];
        cells.push(bottomRight);
      }
    }
    // left
    if (column - 1 >= 0) {
      const left = currentBoard[row][column - 1];
      cells.push(left);
    }
    // right
    if (column + 1 < currentLevel.width) {
      const right = currentBoard[row][column + 1];
      cells.push(right);
    }
    return cells;
  };

  const getCellValue = (cell) => {
    const queue = [cell];
    while (queue.length > 0) {
      const currentCell = queue.pop();
      board[currentCell.row][currentCell.column].isRevealed = true;
      if (currentCell.value === 0) {
        const surroundingCells = getSurroundingCells(currentCell);
        surroundingCells.forEach((surroundingCell) => {
          if (!surroundingCell.isMine && !surroundingCell.isRevealed) {
            queue.push(surroundingCell);
          }
        });
      }
    }

    setBoard(JSON.parse(JSON.stringify(board)));
  };

  const populateNeighboringMines = () => {
    const updatedBoard = board.map((row) => {
      return row.map((cell) => {
        if (!cell.isMine) {
          const surroundingCells = getSurroundingCells(cell);
          const numMines = surroundingCells.reduce((sum, surroundingCell) => {
            if (surroundingCell.isMine) {
              sum += 1;
            }
            return sum;
          }, 0);
          cell.value = numMines;
        }
        return cell;
      });
    });
    setBoard(updatedBoard);
  };

  const initializeBoard = (initialCell) => {
    initializeBoardWithMines(initialCell);
    populateNeighboringMines();
    getCellValue(initialCell);
    console.log("board after initializing:", board);
  };

  const updateCellToClicked = (cell) => {
    if (!board[cell.row][cell.column].isRevealed) {
      board[cell.row][cell.column].isRevealed = true;
      if (board[cell.row][cell.column].isMine) {
        clickedBomb();
      } else {
        console.log("came into updateCellToClicked else");
        getCellValue(cell);
      }
    }
  };

  const cellClicked = (cell) => {
    if (!gameStarted) {
      startGame();
      initializeBoard(cell);
      updateCellToClicked(cell);
    } else {
      updateCellToClicked(cell);
    }
  };

  const displayBoard = () => {
    return board.map((row, rowIndex) => {
      return (
        <div key={rowIndex} className="board-row">
          {row.map((column, columnIndex) => {
            // const cell = board[rowIndex][columnIndex];
            const cell = column;
            return (
              <div key={rowIndex + "_" + columnIndex}>
                <Cell cell={cell} clicked={cellClicked} />
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div>
      {/* <button onClick={reset}>Restart Game</button> */}

      <section className="board">{displayBoard()}</section>
    </div>
  );
};

export default Board;
