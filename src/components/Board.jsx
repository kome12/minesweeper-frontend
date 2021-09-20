import { useEffect, useState } from "react";
import "./board.scss";
import Cell from "./Cell";

const Board = ({
  currentLevel,
  gameStarted,
  startGame,
  clickedBomb,
  gameOver,
  gameComplete,
  completedGame,
  updateFlagCount,
}) => {
  const [board, setBoard] = useState([]);
  const [mineLocations, setMineLocations] = useState([]);

  useEffect(() => {
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
            isIncorrect: false,
            exploded: false,
            value: 0,
          });
        }
        newBoard.push(newRow);
      }
      setBoard(newBoard);
    }
  }, [currentLevel, gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      const flagCount = board.reduce((rowSum, row) => {
        rowSum += row.reduce((columnSum, cell) => {
          columnSum += cell.isFlagged ? 1 : 0;
          return columnSum;
        }, 0);
        return rowSum;
      }, 0);

      const allNonMinesRevealed = board.every((row) =>
        row.every((cell) => cell.isMine || cell.isRevealed)
      );
      if (allNonMinesRevealed) {
        completedGame();
      }

      updateFlagCount(flagCount);
    }
    // eslint-disable-next-line
  }, [board]);

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
    // console.log(`initialCell is ${initialCell.row}, ${initialCell.column}`);
    const mines = [];
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
        // console.log(
        //   `mine #${numMines + 1} is on ${randomCoordinate.row}, ${
        //     randomCoordinate.column
        //   }`
        // );
        mines.push({
          row: randomCoordinate.row,
          column: randomCoordinate.column,
        });
        numMines++;
      }
    }
    setMineLocations(mines);
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
      const currentCell = queue.shift();
      board[currentCell.row][currentCell.column].isRevealed = true;
      if (currentCell.value === 0) {
        const surroundingCells = getSurroundingCells(currentCell);
        surroundingCells.forEach((surroundingCell) => {
          if (
            !surroundingCell.isMine &&
            !surroundingCell.isRevealed &&
            !surroundingCell.isFlagged
          ) {
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
  };

  const updateCellToClicked = (cell) => {
    if (!board[cell.row][cell.column].isRevealed) {
      board[cell.row][cell.column].isRevealed = true;
      if (board[cell.row][cell.column].isMine) {
        board[cell.row][cell.column].exploded = true;
        revealMines();
        clickedBomb();
      } else {
        getCellValue(cell);
      }
    }
  };

  const handleClick = (cell) => {
    if (!gameOver && !cell.isRevealed && !cell.isFlagged) {
      if (!gameStarted) {
        startGame();
        initializeBoard(cell);
        updateCellToClicked(cell);
      } else {
        updateCellToClicked(cell);
      }
    }
  };

  const handleRightClick = (event, cell) => {
    event.preventDefault();
    if (!gameOver && !cell.isRevealed) {
      board[cell.row][cell.column].isFlagged =
        !board[cell.row][cell.column].isFlagged;
      setBoard(JSON.parse(JSON.stringify(board)));
    }
  };

  const revealMines = () => {
    for (const mineLocation of mineLocations) {
      board[mineLocation.row][mineLocation.column].isRevealed = true;
    }

    const updatedBoard = board.map((row) => {
      return row.map((cell) => {
        if (cell.isFlagged && !cell.isMine) {
          cell.isIncorrect = true;
        }
        return cell;
      });
    });

    setBoard(updatedBoard);
  };

  const displayBoard = () => {
    return board.map((row, rowIndex) => {
      return (
        <div key={rowIndex} className="board-row">
          {row.map((column, columnIndex) => {
            const cell = column;
            return (
              <div key={rowIndex + "_" + columnIndex}>
                <Cell
                  cell={cell}
                  clicked={handleClick}
                  rightClicked={handleRightClick}
                />
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div>
      <section className="board">{displayBoard()}</section>
    </div>
  );
};

export default Board;
