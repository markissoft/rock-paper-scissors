import { useCallback, useEffect, useState } from "react";
import { createContext } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/service";
import { io } from "socket.io-client";

export const GameContext = createContext();

export const GameContextProvider = ({ children, user }) => {
  const [userGames, setUserGames] = useState(null);
  const [isUserGamesLoading, setIsUserGamesLoading] = useState(false);
  const [userGamesError, setUserGamesError] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [events, setevents] = useState(null);
  const [eventsError, seteventsError] = useState(null);
  const [iseventsLoading, setIseventsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [sendTexteventError, setSendTexteventError] = useState(null);
  const [newevent, setNewevent] = useState(null);
  const [potentialGames, setPotentialGames] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  console.log("userGames", userGames);
  console.log("currentGame", currentGame);
  console.log("events", events);
  console.log("eventsError", eventsError);
  console.log("onlineUsers", onlineUsers);
  console.log("sendTexteventError", sendTexteventError);
  console.log("notifications", notifications);

  // initialize socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // set online users
  useEffect(() => {
    if (socket === null) return;

    socket.emit("addNewUser", user?._id);
    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [socket]);

  // send event
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentGame?.members.find((id) => id !== user?._id);

    socket.emit("sendevent", { ...newevent, recipientId });
  }, [newevent]);

  // receive event
  useEffect(() => {
    if (socket === null) return;

    socket.on("getevent", (res) => {
      if (currentGame?._id !== res.GameId) return;

      setevents((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isGameOpen = currentGame?.members.some((Id) => Id === res.senderId);

      if (isGameOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getevent");
      socket.off("getNotification");
    };
  }, [socket, currentGame]);

  useEffect(() => {
    const getevents = async () => {
      setIseventsLoading(true);

      const response = await getRequest(
        `${baseUrl}/events/${currentGame?._id}`
      );

      setIseventsLoading(false);

      if (response.error) {
        return seteventsError(error);
      }

      setevents(response);
    };
    getevents();
  }, [currentGame]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("Error fetching users:", response);
      }

      if (userGames) {
        const pGames = response?.filter((u) => {
          let isGameCreated = false;

          if (user._id === u._id) return false;

          isGameCreated = userGames?.some(
            (Game) => Game.members[0] === u._id || Game.members[1] === u._id
          );

          return !isGameCreated;
        });

        setPotentialGames(pGames);
      }

      setAllUsers(response);
    };

    getUsers();
  }, [userGames]);

  useEffect(() => {
    const getUserGames = async () => {
      setIsUserGamesLoading(true);
      setUserGamesError(null);

      if (user?._id) {
        const userId = user?._id;

        const response = await getRequest(`${baseUrl}/Games/${userId}`);

        if (response.error) {
          return setUserGamesError(response);
        }

        setUserGames(response);
      }

      setIsUserGamesLoading(false);
    };

    getUserGames();
  }, [user, notifications]);

  const updateCurrentGame = useCallback(async (Game) => {
    setCurrentGame(Game);
  }, []);

  let selections = {};

  const sendTextevent = useCallback(
    async (textevent, sender, currentGameId, setTextevent) => {
      if (!textevent) return console.log("You must type something...");

      const response = await postRequest(
        `${baseUrl}/events`,
        JSON.stringify({
          GameId: currentGameId,
          senderId: 'server',
          text: 'User selected option!',
        })
      );

      if (response.error) {
        return setSendTexteventError(response);
      }

      const selections = 

      selections.push({
        option: textevent,
      });



      console.log(selections);

      setNewevent(response);
      setevents((prev) => [...prev, response]);
      setTextevent("");
    },
    []
  );

  const createGame = useCallback(async (senderId, receiverId) => {
    const response = await postRequest(
      `${baseUrl}/Games`,
      JSON.stringify({ senderId, receiverId })
    );

    if (response.error) {
      return console.log("Error creating Game:", response);
    }

    setUserGames((prev) => [...prev, response]);
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const modifiedNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(modifiedNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userGames, user, notifications) => {
      // find Game to open
      const readGame = userGames.find((Game) => {
        const GameMembers = [user._id, n.senderId];
        const isDesiredGame = Game?.members.every((member) => {
          return GameMembers.includes(member);
        });

        return isDesiredGame;
      });

      // mark notification as read
      const modifiedNotifications = notifications.map((element) => {
        if (n.senderId === element.senderId) {
          return { ...n, isRead: true };
        } else {
          return element;
        }
      });

      updateCurrentGame(readGame);
      setNotifications(modifiedNotifications);
    },
    []
  );

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      // mark notification as read

      const modifiedNotifications = notifications.map((element) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === element.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = element;
          }
        });

        return notification;
      });

      setNotifications(modifiedNotifications);
    },
    []
  );

  return (
    <GameContext.Provider
      value={{
        userGames,
        isUserGamesLoading,
        userGamesError,
        updateCurrentGame,
        currentGame,
        events,
        eventsError,
        socket,
        sendTextevent,
        onlineUsers,
        potentialGames,
        createGame,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
        newevent,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
