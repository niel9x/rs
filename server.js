const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rs'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

// Rota para login (exemplo)
app.post('/', (req, res) => {
    const { tel, password } = req.body;

    const sql = 'SELECT * FROM users WHERE TEL = ? AND PASSWORD = ?';
    db.query(sql, [tel, password], (err, results) => {
        if (err) {
            console.error('Erro ao executar consulta SQL:', err);
            res.status(500).send('Erro interno');
            return;
        }

        if (results.length > 0) {
            res.send('Login bem-sucedido');
        } else {
            res.send('Telefone ou senha incorretos');
        }
    });
});

// Rota para registrar uma nova doação
app.post('/donations', (req, res) => {
    const { id_user, donation_value, name, email, payment_method } = req.body;

    const sql = 'INSERT INTO donations (ID_USER, DONATION_VALUE, NAME, EMAIL, PAYMENT_METHOD) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id_user, donation_value, name, email, payment_method], (err, results) => {
        if (err) {
            console.error('Erro ao registrar doação:', err);
            res.status(500).send('Erro interno');
            return;
        }

        res.send('Doação registrada com sucesso');
    });
});

// Rota para obter todas as doações de um usuário específico
app.get('/donations/:id_user', (req, res) => {
    const id_user = req.params.id_user;

    const sql = 'SELECT * FROM donations WHERE ID_USER = ?';
    db.query(sql, [id_user], (err, results) => {
        if (err) {
            console.error('Erro ao obter doações:', err);
            res.status(500).send('Erro interno');
            return;
        }

        res.json(results);
    });
});

// Servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servir a página de doações
app.get('/doe', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view', 'doe', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
