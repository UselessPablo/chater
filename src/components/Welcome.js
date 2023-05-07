import React from "react";
import { auth, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import ChatBox from "./ChatBox";
import { useState, useEffect } from "react";

const Welcome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const loginWithGoogle = () => {
    const provider = new db.auth.GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return user !== null ? (
    <ChatBox user={user} />
  ) : (
    <div className="login">
      <h1>Por favor te debes loguear para iniciar un chat</h1>
      <button onClick={loginWithGoogle}>Login with Google</button>
    </div>
  );
};

export default Welcome;
