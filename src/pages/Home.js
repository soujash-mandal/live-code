import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setroomId] = useState("");
  const [username, setusername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setroomId(id);
    toast.success("new room created");
    console.log(id);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room ID & username is required");
      return;
    }

    //Redirect

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formwrapper">
        <h2>Live Code</h2>
        <hr></hr>
        <h4 className="mainLabel">Paste room Id</h4>
        <div className="inputGroup">
          <input
            className="inputBox"
            type="text"
            placeholder="ROOM ID"
            value={roomId}
            onKeyUp={handleInputEnter}
            onChange={(e) => {
              setroomId(e.target.value);
            }}
          />
          <input
            className="inputBox"
            type="text"
            placeholder="USERNAME"
            onKeyUp={handleInputEnter}
            onChange={(e) => {
              setusername(e.target.value);
            }}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new ROOM
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
