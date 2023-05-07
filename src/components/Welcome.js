import React from "react";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
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
    auth.signInWithPopup(provider).then((result) => {
      setUser(result.user);
    });
  };

  return user !== null ? (
    <ChatBox user={user} />
  ) : (
    <div className="login">
      <h1>Login</h1>
      {/* <button onClick={loginWithGoogle}>Login with Google</button> */}
    </div>
  );
};

export default Welcome;
