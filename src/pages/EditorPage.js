import React, { useEffect, useRef, useState } from "react";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

const EditorPage = () => {
  // Add an event listener to the beforeunload event
  window.addEventListener("beforeunload", function (event) {
    // Cancel the event (modern browsers will display a confirmation dialog)
    event.preventDefault();
    // Set the custom message to be displayed in the confirmation dialog
    event.returnValue =
      "Are you sure you want to leave? Your changes may not be saved.";
  });

  const socketRef = useRef();
  const location = useLocation();
  const { roomId } = useParams();

  const reactNavigator = useNavigate();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket Connection Failed , try again later");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      //listening for joining event

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          // if (username !== location.state?.username) {
          //   // toast.success(`${username} joined the room`);
          //   // console.log(username, "joined");
          // }
          // double socket id creation problem resolved
          // Filter out objects at odd positions
          // let filteredClients = clients.filter((_, index) => index % 2 === 0);
          let uniqueUsernames = new Set();
          let filteredClients = clients.filter((client) => {
            if (!uniqueUsernames.has(client.username)) {
              uniqueUsernames.add(client.username);
              return true;
            }
            return false;
          });
          setclients(filteredClients);
        }
      );

      //Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        // toast.success(`${username} left the room`);
        setclients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      // console.log(socketRef.current.off);
      // socketRef.current.disconnect();
      // socketRef.current.off(ACTIONS.JOINED);
      // socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const [clients, setclients] = useState([]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id Copied");
    } catch (error) {
      console.log(error);
    }
  }

  async function leaveRoom() {
    reactNavigator("/");
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <h2>Live Code</h2>
          <hr></hr>
          <h4>Connected Users</h4>
          <div className="clientsList">
            {clients.map((client) => (
              <>
                <h5 className="client">{client.username}</h5>
              </>
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor roomId={roomId} socketRef={socketRef} />
      </div>
    </div>
  );
};

export default EditorPage;
