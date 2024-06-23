const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 8080


// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('C:\Users\Laptop\project\auth-app\db');

// Crear tabla Usuarios si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        contraseña TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table Usuarios created or already exists.');
        }
    });
});

// Registro de usuario
app.post('/register', (req, res) => {
    const { nombre, email, contraseña } = req.body;
    const hash = bcrypt.hashSync(contraseña, 8);

    const stmt = db.prepare(`INSERT INTO Usuarios (nombre, email, contraseña) VALUES (?, ?, ?)`);
    stmt.run(nombre, email, hash, (err) => {
        if (err) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }
        res.status(201).json({ message: 'Usuario registrado' });
    });
    stmt.finalize();
});

// Login de usuario
app.post('/login', (req, res) => {
    const { email, contraseña } = req.body;

    db.get(`SELECT * FROM Usuarios WHERE email = ?`, [email], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error del servidor' });
        }
        if (!row || !bcrypt.compareSync(contraseña, row.contraseña)) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        res.status(200).json({ message: 'Login exitoso' });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});