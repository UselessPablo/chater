import { useState, useEffect, useRef } from "react";
import { db } from '../firebase'
import Message from "../components/Message";
import { serverTimestamp, orderBy } from "firebase/firestore";
import { doc, addDoc, collection, query, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { Box, Typography, Avatar, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from 'firebase/auth';
import SendIcon from '@mui/icons-material/Send';

const ChatBox = ({ user, avatar,nombre }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const navigate = useNavigate();
  const auth = getAuth();

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
        user: { displayName: user?.displayName, photoURL: avatar || '' },
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, 'messages'), newMessage).catch((error) => {
        console.error("Error adding document: ", error);
      });
      setInput("");
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/Login')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ml:5}} >
      <Box sx={{display:'flex', justifyContent:'center', mb:2}} >
        {user && user.photoURL && <Avatar src={user.photoURL} alt="" />}
        {user?.displayName && (
          <Typography variant="h6" component="h6">
            {user.displayName}
          </Typography>
        )}

      </Box>
      <Box>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <Box sx={{ m: 1, padding: 2 }}
          ref={scrollRef}
          style={{ float: "left", clear: "both", paddingTop: "4rem" }}
        ></Box>
      </Box>
      <Box >
        <form onSubmit={sendMessages}>
          <TextField
            sx={{mt:2}}
            type="text"
            placeholder="Mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit"><SendIcon color="success" sx={{mt:3}}/></Button>
        </form>
      </Box>
      <Button variant="contained" sx={{backgroundColor:'red.main', mt:3, color:'white', ml:8}} onClick={handleSignOut}>Salir</Button>
    </Box>
  );
};

export default ChatBox;
