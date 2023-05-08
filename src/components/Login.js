import {  signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Box, Button, Avatar, TextField, Typography } from '@mui/material';
import { storage, auth } from '../firebase';
import { getDownloadURL, uploadBytes, ref as sRef } from '@firebase/storage';
import { updateProfile } from 'firebase/auth';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import ChatBox from './ChatBox';



const Login = () => {

    const [error, setError] = useState('');
    const [email, setMail] = useState('');
    const [file, setFile] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const formRef = useRef({
        email: '',
        password: '',
        name: '',
        apellido: '',
        telefono: '',
    });
    const [user, setUser] = useState(null)
    const [avatar, setAvatar] = useState(null);
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState(null)
    const [apellido, setApellido] = useState(null)
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [avatarUpdated, setAvatarUpdated] = useState(false);
    const [openLoginSnackbar, setOpenLoginSnackbar] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                setAvatar(user.photoURL);
            }
        });
        return unsubscribe;
    },);



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
                setOpenLoginSnackbar(true);
                setAvatarUpdated(false);
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

    // console.log(setUserAvatar);
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
    // const setUserAvatar = useContext(UseUserContext);
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
                                    setAvatarUpdated(true); 
                                    setOpenLoginSnackbar(false);                 
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
    useEffect(() => {
        if (avatarUpdated) {
            setOpen(true);
            setAvatarUpdated(false);
        }
    }, [avatarUpdated]);
    
    const handleLogin2 = (e) => {
        e.preventDefault();
        const names = formRef.current?.name?.value;
        // ctualizar los estados de name, apellido y telefono
        setNombre(names);
        // Obtener el usuario actualmente autenticado
        const user = auth.currentUser;
        // Actualizar la información del perfil del usuario con los nuevos datos
        updateProfile(user, {
            displayName: `${names}`,
         
        })
            .then(() => {
                console.log('Perfil de usuario actualizado');
                // Actualizar los estados de name, apellido y telefono con los valores ingresados en el formulario
                setNombre(names);
       
                navigate('/')
                // Aquí puedes hacer algo como redirigir al usuario a otra página, mostrar un mensaje de éxito, etc.
            })
            .catch((error) => {
                console.error(error);
                setError(error.message);
            });
    };
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
                setLoggedIn(false);
                setMail('');
                setAvatar(null);
                setNombre(null);
                setApellido(null);
                setTelefono(null);
                console.log('Logout successful');
            })
            .catch((error) => {
                console.error(error);
                setError(error.message);
            });
    };
    const handleCloseLoginSnackbar = () => {
        setOpenLoginSnackbar(false);
    };

    // const handleCloseAvatarSnackbar = () => {
    //     setOpenAvatarSnackbar(false);
    // };
    return (

        <Box sx={{ ml: 6, mt: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
            <Snackbar
                sx={{ borderRadius: 4 }}
                open={openLoginSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={2400} // ocultar después de 3 segundos
                onClose={handleCloseLoginSnackbar}
                message="Logueado con Exito"
            />
            {user && avatar && (
                <Avatar src={avatar} />
            )}
            {!loggedIn && (
                <form ref={formRef} >
                    <h3 >Ingresa con Email y contraseña </h3>
                    <Box  sx={{mt:1}} >
                        <TextField
                            variant='filled'
                            type="email"
                            name="email"
                            onChange={emailHandler}
                            aria-describedby="emailHelp"
                            required={true}
                           
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
                        <IconButton sx={{ mt: 1, ml: 1 }} onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </Box>

                    <p><small className='red'>{error}</small></p>

                    <Button onClick={handleLogin} sx={{ mt: 1,mb:2 }} variant='contained' size='small'>Enviar</Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <p><small>No tienes cuenta? Crea una... <Link to={'/Register'}>REGISTRARSE</Link></small></p>
                        <p><small>Olvidaste tu contraseña </small><Button sx={{ ml: 1, mt: 1, mb: 1, color: 'white', backgroundColor: 'navbar.main' }} variant='contained' size='small' onClick={handlerForgetPassword}>Restablecer</Button></p>
                        <p><small>Abandonar sesión</small>   <Button sx={{  ml: 2, backgroundColor:'red.main', color:'white' }} variant="contained" size='small' onClick={handleLogout}>
                            Logout
                        </Button> </p>
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
                            size='small'
                            sx={{ ml: 2, mt: 2 }}
                        >cargar imagen</Button>
                    </Box>
                    <Snackbar
                        open={open}
                        autoHideDuration={3000}
                        onClose={() => setOpen(false)}
                        message="Avatar Actualizado"
                    />

                    <Typography textAlign='start' sx={{ mt: 4, ml: 5 }}>Aqui puedes cambiar tu imagen y tu nombre</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
                        <form className='formDetails' ref={formRef} onSubmit={handleLogin2}>
                            <TextField name="name" label="Apodo..." />
                            <Button variant='contained' sx={{ ml:2, mt:1, backgroundColor:'fondo.main', color:'white'}} type="submit">Enviar</Button>
                        </form>
                    </Box>
                               
                </>
           
            )}
            <ChatBox avatar={avatar} user={user} nombre={nombre} />
        </Box>
    );
};


export default Login