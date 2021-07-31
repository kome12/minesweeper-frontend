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
    return cell.value ? `mine${cell.value > 1 ? "s" : ""}-${cell.value}` : "";
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
