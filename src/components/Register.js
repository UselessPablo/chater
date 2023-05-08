import React, { useState } from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from 'firebase/auth';
import {db, auth} from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Box } from '@mui/material';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';



const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        let form = e.target;
        let email = form.email.value;
        let password = form.password.value;
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                console.log(user);
                setSuccess('Registration successful...');
                form.reset();
                mailVarification();
                clear();
            })
            .catch((err) => {
                console.log(err);
                setError('This username is already Exist! try another one');
            });
    };

    const mailVarification = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                alert('Perfecto, Ya Puedes Loguearte Para Ingresar');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const clear = () => {
        setForm(false);
        console.log('dd');
    };

    return (
     
        <Box sx={{ ml: 6, mt: 2 }}>
            <form onSubmit={submitHandler}>
                <h3>Completa los datos para Registrarte</h3>
                <Box>
                    <Input
                        variant="filled"
                        type="email"
                        name="email"
                        id="formGroupExampleInput2"
                        placeholder="Email"
                        required
                    />
                </Box>
                <Box>
                    <Input
                        variant="filled"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="formGroupExampleInput3"
                        placeholder="Password"
                        required
                    />
                    <IconButton
                        sx={{ mt: 1, ml: 1 }}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <p><small className='error' >{error}</small></p>
                    <p><small >{success}</small></p>
                </Box>
                <Button type="submit" variant='contained' size='small' sx={{ ml: 15, mt: 1, mb: 2 }} >Enviar</Button>
                <p><small>Ya tienes cuenta? <Link to={'/Login'} onClick={clear}>LOGIN</Link></small></p>
            </form>

        </Box>

    );
};
 
export default Register;
