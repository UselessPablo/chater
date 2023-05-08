import {useState, useEffect, useRef} from 'react';
import { auth } from "../firebase";
import ChatBox from "./ChatBox";
import {onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile} from 'firebase/auth';
import {storage} from '../firebase';
import {getDownloadURL, uploadBytes, ref as sRef} from '@firebase/storage';
import {Link} from 'react-router-dom';
import {Input, Box, Button, Avatar, TextField, Typography, IconButton} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
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
    }, );
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
        const storageRef = sRef(storage, 'usuario');
        uploadBytes(storageRef, file)
            .then((snapshot) => {
                console.log(snapshot);
                getDownloadURL(snapshot.ref).then((url) => {
                    console.log(url);
                    const user = auth.currentUser;
                    if (user) {
                        if (user.photoURL !== url) {
                            updateProfile(user, {
                                photoURL: url,
                            })
                                .then(() => {
                                    console.log('Profile updated successfully!');
                                    setAvatar(url);                  
                                })
                                .catch((error) => {
                                    console.error(error);
                                    setError(error.message);
                                });
                        } else {
                            console.log('Photo URL is already set to', url);
                        }
                    } else {
                        console.error('No user is signed in');
                    }
                });
            })
            .catch((error) => {
                console.error(error);
                setError(error.message);
            });
    };
    const handleLogin2 = (e) => {
        e.preventDefault();
        const names = formRef.current.name.value;
        const apellidos = formRef.current.apellido.value;
        const telefonos = formRef.current.telefono.value;
        setNombre(names);
        const user = auth.currentUser;
        updateProfile(user, {
            displayName: `${names} ${apellidos}`,
            phoneNumber: telefonos
        })
            .then(() => {
                console.log('Perfil de usuario actualizado');
                setNombre(names);
            })
            .catch((error) => {
                console.error(error);
                setError(error.message);
            });
    };
 
  return user !== null ? (
    <ChatBox user={user} />
  ) : (
       <Box sx={{ ml: 6, mt: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>   
          
            <Snackbar
                sx={{ borderRadius:4}}
                open={open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={2400} // ocultar después de 3 segundos
                onClose={() => setOpen(false)} // cerrar el Snackbar
                message="Logueado con Exito"   
            />
            {user && avatar && (
                <Avatar src={avatar} />
            )}
            {!loggedIn && (
                <form ref={formRef} >
                    <h3 >Ingresa con Email y contraseña </h3>
                    <Box >
                        <TextField
                            variant='filled'
                            type="email"
                            name="email"
                            onChange={emailHandler}
                            aria-describedby="emailHelp"
                            color='info'
                        />
                    </Box>    
                    <Box >
                        <TextField
                            variant='filled'
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            label="Password"
                            
                        />

                        <IconButton sx={{mt:1, ml:1}} onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </Box>
                    
                    <p><small className='red'>{error}</small></p>            
                    
                    <Button onClick={handleLogin} sx={{mb:2}} variant='contained' color='info' size='small'>Enviar</Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <p><small>No tienes cuenta? Crea una... <Link to={'/Register'}>REGISTRARSE</Link></small></p>
                    <p><small>Olvidaste tu contraseña </small><Button sx={{ ml: 1, color:'white' }} variant='contained'  size='small' onClick={handlerForgetPassword}>Restablecer</Button></p>
                           
                    </Box>
                </form>
            )}
            {loggedIn && (
                <>
                    <Box sx={{}}>
                        {/* <Box sx={{ mb: 4, ml:6, }}> */}
                        <Input type="file" onChange={handleFileChange} placeholder='Seleciona una imagen de avatar' />
                        <Button onClick={handleUpload}
                            variant='contained'
                            color='info2'
                            size='small'
                            sx={{ ml: 2, mt: 2 }}
                        >cargar imagen</Button>
                    </Box>
                    <Typography textAlign='start' sx={{ mt: 4, ml: 5 }}>Completa el siguiente formulario</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
                        <form className='formDetails' ref={formRef} onSubmit={handleLogin2}>
                            <TextField placeholder='Nombre' variant='filled' name='name' type='text' onChange={(e) => {
                                setNombre(e.target.value);
                            }} />
                            <TextField placeholder='Apellido' variant='filled' name='apellido' type='text' />
                            <TextField placeholder='Teléfono' variant='filled' name='telefono' type='number' />
                            <Button variant='contained' sx={{ mt: 2, mb: 5 }} type="submit">Enviar</Button>
                        </form>
                    </Box>

                </>
            )}

        </Box>
    );
};


export default Login;
