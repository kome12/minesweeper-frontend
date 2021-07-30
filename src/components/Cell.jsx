import "./cell.scss";

const Cell = ({ cell, clicked, rightClicked }) => {
  const clickedCell = () => {
    clicked(cell);
  };

  const rightClickCell = (event) => {
    rightClicked(event, cell);
  };

  const displayCell = () => {
    // if (cell.isMine) {
    //   return "💣";
    // }
    if (cell.exploded) {
      return "💣";
    } else if (cell.isIncorrect) {
      return "⚠️";
    } else if (cell.isRevealed) {
      if (cell.isMine) {
        return "💣";
      }
      return cell.value !== 0 ? cell.value : null;
    } else if (cell.isFlagged) {
      return "🚩";
    }
    return null;
  };

  const addClassNameBasedOnValue = (cell) => {
    switch (cell.value) {
      case 1:
        return "one-mine";
      case 2:
        return "two-mines";
      case 3:
        return "three-mine";
      case 4:
        return "four-mines";
      case 5:
        return "five-mine";
      case 6:
        return "six-mines";
      case 7:
        return "seven-mine";
      case 8:
        return "eight-mines";
      default:
        return "";
    }
  };

  return (
    <div
      className={`cell ${
        cell.isRevealed && !cell.isMine
          ? "reveal " + addClassNameBasedOnValue(cell)
          : ""
      } ${cell.exploded ? "exploded" : ""}`}
      onClick={clickedCell}
      onContextMenu={rightClickCell}
    >
      {displayCell()}
    </div>
  );
};

export default Cell;
