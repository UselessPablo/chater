
import Welcome from "./Welcome"
import ChatBox from "./ChatBox"
import NavBar from "./NavBar"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {auth} from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';


const Router = () => {
     const [user] = useAuthState(auth);
   
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route path='/' element={<NavBar/>}>
                </Route>
                <Route path='/ChatBox/' element={<ChatBox />} />
                    <Route path='/Welcome/' element={!user ? <Welcome /> : <ChatBox />} />
        
            </Routes>
        </BrowserRouter>
    )
}
export default Router;