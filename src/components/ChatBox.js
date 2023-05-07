import { useState, useEffect, useRef } from "react";
import { db } from '../firebase'
import Message from "../components/Message";
import { serverTimestamp, orderBy } from "firebase/firestore";
import { doc, addDoc, collection, query, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { Box,Typography,Avatar, TextField, Button } from "@mui/material";
const ChatBox = ({ user }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();


  useEffect(() => {
    const db = getFirestore();
    const messagesCollection = collection(db, 'messages');
    onSnapshot(
      query(messagesCollection, orderBy('timestamp', 'asc')),
      (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );
  }, []);

  const sendMessages = async (e) => {
    e.preventDefault();
    console.log(user);
    if (!user) {
      return;
    }
   
    if (input !== "") {
      const newMessage = {
        message: input,
        user: { displayName: user?.displayName, photoURL: user?.photoURL },
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, 'messages'), newMessage).catch((error) => {
        console.error("Error adding document: ", error);
      });
      setInput("");
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box className="chat__box">
      <Box className="chat__header">
        {user && user.photoURL && <Avatar src={user.photoURL} alt="" />}

        <p>{user?.displayName}</p>
      </Box>
      <Box className="chat__messages">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <Box
          ref={scrollRef}
          style={{ float: "left", clear: "both", paddingTop: "4rem" }}
        ></Box>
      </Box>
      <Box className="chat__input">
        <form onSubmit={sendMessages}>
          <TextField
            type="text"
            placeholder="Type a message here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
         
          <Button>&rarr;</Button>
        </form>
      </Box>
    </Box>
  );
};

export default ChatBox;
