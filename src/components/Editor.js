import React, { useEffect, useRef, useState } from "react";
import ACTIONS from "../Actions";
import { initSocket } from "../socket";

const Editor = ({ roomId, socketRef }) => {
  const [editorContent, seteditorContent] = useState("");
  // const socketRef = useRef();
  const editorRef = useRef(null);
  // const [value, setvalue] = useState("");

  function handleChange(event) {
    // editorRef.current.value = event.target.value;
    let code = event.target.value;
    seteditorContent(code);
    // console.log("code", code);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code,
    });
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("recieving ", code);
        if (code !== null) {
          console.log("code", code);
          seteditorContent(code);
        }
      });
    };

    init();
  }, []);

  useEffect(() => {
    console.log("changing ref");

    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("recieving", code);
        if (code != null) {
          seteditorContent(code);
        }
      });
    }

    return () => {
      // socketRef.current.off(ACTIONS.CODE_CHANGE,()=>{});
    };
  }, [socketRef.current]);

  return (
    <div className="realtimeEditorDiv">
      <textarea
        id="realtimeEditor"
        rows={33}
        cols={135}
        value={editorContent}
        onChange={handleChange}
        placeholder="Write your code here ..."
      ></textarea>
    </div>
  );
};

export default Editor;
