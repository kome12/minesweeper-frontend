import "./cell.scss";

const Cell = ({ cell, clicked, rightClicked }) => {
  const clickedCell = () => {
    clicked(cell);
  };

  const rightClickCell = () => {
    // rightClicked(cell);
  };

  const displayCell = () => {
    if (cell.isRevealed) {
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
      {/* {cell.isMine ? "💣" : cell.isRevealed ? cell.value : ""} */}
      {cell.isRevealed ? cell.value : ""}
    </div>
  );
};

export default Cell;
