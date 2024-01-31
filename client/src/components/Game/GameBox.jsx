// import { useState, useContext } from "react";
// import { Stack, Form, Button } from "react-bootstrap";
// import { AuthContext } from "../../context/AuthContext";
// import { GameContext } from "../../context/GameContext";
// import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
// import moment from "moment";
// import { useEffect } from "react";

// const GameBox = () => {
//   const { user } = useContext(AuthContext);
//   const { currentGame, events, iseventsLoading, sendTextevent } = useContext(GameContext);
//   const { recipientUser } = useFetchRecipientUser(currentGame, user);
//   const [textevent, setTextevent] = useState("");

//   useEffect(() => {
//     // You can add any necessary useEffect logic here
//   }, [events]);



//   const handleRockPaperScissors = () => {
//     // Handle the rock-paper-scissors game logic here
//     console.log(`You chose: ${selectedOption}`);
//   };

//   if (!recipientUser)
//     return (
//       <p style={{ textAlign: "center", width: "100%" }}>
//         No conversation selected yet..
//       </p>
//     );

//   if (iseventsLoading)
//     return (
//       <p style={{ textAlign: "center", width: "100%" }}>Loading Game...</p>
//     );

//   return (
//     <Stack gap={4} className="Game-box">
//       <div className="Game-header">
//         <strong>{recipientUser?.name}</strong>
//       </div>
//       <Stack gap={3} className="events">
//         {/* You can optionally display previous events here */}
//       </Stack>
//       <Stack direction="horizontal" className="Game-input flex-grow-0" gap={3}>

//       </Stack>
//     </Stack>
//   );
// };

// export default GameBox;

import { useRef, useState } from "react";
import { useContext } from "react";
import { Stack, Form, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { GameContext } from "../../context/GameContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { useEffect } from "react";

const GameBox = () => {
  const { user } = useContext(AuthContext);
  const { currentGame, events, sendTextevent, iseventsLoading } =
    useContext(GameContext);
  const { recipientUser } = useFetchRecipientUser(currentGame, user);
  const [textevent, setTextevent] = useState("");
  const scroll = useRef();

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  if (!recipientUser)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No conversation selected yet..
      </p>
    );

  if (iseventsLoading)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading Game...</p>
    );

  return (
    <Stack gap={4} className="Game-box">
      <div className="Game-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className="events">
        {events &&
          events?.map((event, index) => (
            <Stack
            className={`${
              event?.senderId === user?._id
                ? "event self align-self-end flex-grow-0"
                : event?.senderId === 'server'
                  ? "event d-flex align-items-center justify-content-center flex-grow-1"
                  : "event align-self-start flex-grow-0"
            }`}
            
              key={index}
              ref={scroll}
            >
              <span>{event.text}</span>
              <span className="event-footer">
                {moment(event.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>
      <Stack direction="horizontal" className="Game-input flex-grow-0" gap={3}>
      <Form.Group>
          <Form.Check
            type="radio"
            name="rock-paper-scissors"
            id="rock"
            label="Rock"
            value="rock"
            checked={selectedOption === "rock"}
            onChange={handleOptionChange}
          />
          <Form.Check
            type="radio"
            name="rock-paper-scissors"
            id="paper"
            label="Paper"
            value="paper"
            checked={selectedOption === "paper"}
            onChange={handleOptionChange}
          />
          <Form.Check
            type="radio"
            name="rock-paper-scissors"
            id="scissors"
            label="Scissors"
            value="scissors"
            checked={selectedOption === "scissors"}
            onChange={handleOptionChange}
          />
        </Form.Group>
        {/* Submit button */}
        <Button onClick={() => sendTextevent(selectedOption, user, currentGame._id, setTextevent)}>Submit</Button>
      </Stack>
    </Stack>
  );
};

export default GameBox;
