
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import Welcome from "./Welcome";
import ChatBox from './ChatBox';


const NavBar = () => {
  const [user] = useAuthState(auth);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };
  const signOut = () => {
    auth.signOut();
  };

  return (
    <>
    <nav className="nav-bar">
      <h1>Chater</h1>
      {user ? (
        <button onClick={signOut} className="sign-out" type="button">
          Salir
        </button>
      ) : (
        <button className="sign-in">
          <img
            onClick={googleSignIn}
            src={GoogleSignin}
            alt="sign in with google"
            type="button"
          />
        </button>
      )}
    </nav>
  {!user ? <Welcome /> : <ChatBox />}
    </>
  );
};

export default NavBar;
