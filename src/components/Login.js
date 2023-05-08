import { useState, useEffect, useRef } from 'react';
import { auth } from "../firebase";
import ChatBox from "./ChatBox";
import { onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { storage } from '../firebase';
import { getDownloadURL, uploadBytes, ref as sRef } from '@firebase/storage';
import { Link } from 'react-router-dom';
import { Input, Box, Button, Avatar, TextField, Typography, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';


const Login = () => {

    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [email, setMail] = useState('');
    const [file, setFile] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const formRef = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const [nombre, setNombre] = useState(null)
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                setAvatar(user.photoURL);
            }
        });
        return unsubscribe;
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        let email = formRef.current.email.value;
        let password = formRef.current.password.value;

        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                setLoggedIn(user);
                formRef.current.reset();
                setOpen(true);
                setError('');
            })
            .catch((error) => {
                console.error(error);
                setError(error.message);
            });
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const emailHandler = (e) => {
        let mail = e.target.value;
        setMail(mail);
    };

    const handlerForgetPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Your password reset link has been sent to your email');
            })
            .catch((error) => {
                console.error(error);
                setError(error.message);
            });
    };

    const handleUpload = () => {
        if (!file) {
            console.error('No file selected');
            return;
        }
        if (!user) {
            console.error('No user is signed in');
            return;
        }
        const storageRef = sRef(storage, `avatar/${user.uid}`);
        uploadBytes(storageRef, file)
            .then((snapshot) => {
                console.log(snapshot);
                getDownloadURL(snapshot).then((url) => {
                    console.log(url);
                    setAvatar(url);
                    updateProfile(auth.currentUser, {
                        photoURL: url,
                    })
                        .then(() => {
                            console.log('Profile photo updated');
                        })
                        .catch((error) => {
                            console.error(error);
                            setError(error.message);
                        });
                })
                    .catch((error) => {
                        console.error(error);
                        setError(error.message);
                    });
            });


const handleNameChange = () => {
    if (!nombre) {
        console.error('Name is required');
        return;
    }
    if (!user) {
        console.error('No user is signed in');
        return;
    }
    updateProfile(auth.currentUser, {
        displayName: nombre,
    })
        .then(() => {
            console.log('Profile name updated');
            formRef.current.reset();
            setOpen(true);
        })
        .catch((error) => {
            console.error(error);
            setError(error.message);
        });
};

const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
};

const handleMouseDownPassword = (event) => {
    event.preventDefault();
};

const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpen(false);
};

return (
<>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {user ? (
                <ChatBox avatar={avatar} />
            ) : (
                <Box sx={{ width: '400px', p: 4, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
                    <Avatar alt="Avatar" src={avatar} sx={{ width: '100px', height: '100px', margin: '0 auto 16px' }} />
                    <form ref={formRef} onSubmit={handleLogin}>
                        <Typography variant="h5" gutterBottom>
                            Login
                        </Typography>
                        <TextField
                            label="Email"
                            variant="outlined"
                            type="email"
                            name="email"
                            fullWidth
                            margin="normal"
                            onChange={emailHandler}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            fullWidth
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                ),
                            }}
                        />
                        <Button variant="contained" type="submit" fullWidth>
                            Sign In
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Link to="/signup">Create new account</Link>
                            <Link to="#" onClick={handlerForgetPassword}>
                                Forgot password?
                            </Link>
                        </Box>
                    </form>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Upload profile photo
                        </Typography>
                        <Input type="file" onChange={handleFileChange} />
                        <Button variant="contained" onClick={handleUpload} sx={{ mt: 1 }}>
                            Upload
                        </Button>
                    </Box>
       </Box>
            )}
        
        </Box>
        
        
   
       </>     
    
    
    );
};
}
export default Login;
