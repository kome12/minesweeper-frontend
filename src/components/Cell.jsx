import "./cell.scss";

const Cell = ({ cell, clicked, rightClicked }) => {
  const clickedCell = () => {
    clicked(cell);
  };

  const rightClickCell = (event) => {
    rightClicked(event, cell);
  };

  const displayCell = () => {
    if (cell.exploded) {
      return "❌";
    } else if (cell.isIncorrect) {
      return "⚠️";
    } else if (cell.isRevealed) {
      if (cell.isMine) {
        return "💣";
      }
      return cell.value;
    } else if (cell.isFlagged) {
      return "🚩";
    }
    return null;
  };

  return (
    <div className="cell" onClick={clickedCell} onContextMenu={rightClickCell}>
      {displayCell()}
    </div>
  );
};

export default Cell;
