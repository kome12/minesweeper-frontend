import "./records.scss";

const Records = ({ games }) => {
  const createPreviousResultsList = (level) => {
    const gamesbyLevel = games[level];
    if (gamesbyLevel) {
      return gamesbyLevel.map((game, index) => {
        return (
          <div key={game.id} className="record-entry">
            <div>{index + 1}.</div>
            <div>{game.name}</div>
            <div>{game.time}</div>
          </div>
        );
      });
    }
    return null;
  };

  return (
    <section className="previous-results">
      <div className="results-category">
        <h4>Beginner</h4>
        {createPreviousResultsList("beginner")}
      </div>
      <div className="results-category">
        <h4>Intermediate</h4>
        {createPreviousResultsList("intermediate")}
      </div>
      <div className="results-category">
        <h4>Expert</h4>
        {createPreviousResultsList("expert")}
      </div>
    </section>
  );
};

export default Records;
