import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import AllUsers from "../components/Game/AllUsers";
import GameBox from "../components/Game/GameBox";
import UserCard from "../components/Game/UserCard";
import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";

const Game = () => {
  const { user } = useContext(AuthContext);

  const { userGames, isUserGamesLoading, updateCurrentGame } =
    useContext(GameContext);

  return (
    <Container>
      <AllUsers />
      {userGames?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="events-box flex-grow-0 pe-3" gap={3}>
            {isUserGamesLoading && <p>Fetching Games..</p>}
            {(!isUserGamesLoading && !userGames) ||
              (!userGames?.length === 0 && <p>No Games..</p>)}
            {userGames?.map((Game, index) => {
              return (
                <div key={index} onClick={() => updateCurrentGame(Game)}>
                  <UserCard Game={Game} user={user} />
                </div>
              );
            })}
          </Stack>
          <GameBox />
        </Stack>
      )}
    </Container>
  );
};

export default Game;
