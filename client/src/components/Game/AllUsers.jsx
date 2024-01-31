import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { GameContext } from "../../context/GameContext";

const AllUsers = () => {
  const { user } = useContext(AuthContext);
  const { potentialGames, createGame } = useContext(GameContext);
  const { onlineUsers } = useContext(GameContext);

  return (
    <>
      <div className="all-users">
        {potentialGames &&
          potentialGames.map((receiver, index) => (
            <div
              className="single-user"
              key={index}
              onClick={() => createGame(user._id, receiver._id)}
              style={{ color: "black" }} 
            >
              {receiver.name}
              <span
                className={
                  onlineUsers?.some((user) => user?.userId === receiver?._id)
                    ? "user-online"
                    : ""
                }
              ></span>
            </div>
          ))}
      </div>
    </>
  );
};

export default AllUsers;
