import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/register', {
                name,
                email,
                password
            });
            alert(response.data.message); // Muestra el mensaje de éxito
            setName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error al intentar registrar. Por favor, intenta de nuevo más tarde.');
            }
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Registro de Usuario</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <input 
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input 
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Registrarse</button>
        </form>
    );
};

export default Register;


