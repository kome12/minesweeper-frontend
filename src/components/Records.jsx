import axios from "axios";
import { useEffect, useState } from "react";
import "./records.scss";

const Records = () => {
  const [games, setGames] = useState({
    beginner: [],
    intermediate: [],
    expert: [],
  });

  useEffect(() => {
    const getGames = async () => {
      console.log("process.env.API_URL:", process.env.REACT_APP_API_URL);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/games`);
      if (res.data && res.data.data) {
        setGames(res.data.data);
      }
    };

    getGames();
  }, []);

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
      <div>
        <h4>Beginner</h4>
        {createPreviousResultsList("beginner")}
      </div>
      <div>
        <h4>Intermediate</h4>
        {createPreviousResultsList("intermediate")}
      </div>
      <div>
        <h4>Expert</h4>
        {createPreviousResultsList("expert")}
      </div>
    </section>
  );
};

export default Records;
