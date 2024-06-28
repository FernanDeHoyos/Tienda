const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/guardar-compra', (req, res) => {
    console.log('Solicitud recibida en /guardar-compra');
    console.log('Datos recibidos:', req.body);

    const compras = req.body;

    fs.readFile('compras.json', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de compras:', err);
            return res.status(500).send('Error al procesar el archivo de compras');
        }

        let comprasExistentes = [];
        try {
            comprasExistentes = JSON.parse(data);
        } catch (error) {
            console.error('Error al parsear JSON existente:', error);
            return res.status(500).send('Error al procesar el archivo de compras');
        }

        comprasExistentes.push(compras);

        fs.writeFile('compras.json', JSON.stringify(comprasExistentes, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar la compra:', err);
                return res.status(500).send('Error al guardar la compra');
            }
            console.log('Compra guardada exitosamente');
            res.send('Compra guardada exitosamente');
        });
    });
});

app.get('/obtener-compras', (req, res) => {
    fs.readFile('compras.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de compras:', err);
            return res.status(500).send('Error al leer el archivo de compras');
        }

        try {
            const compras = JSON.parse(data);
            res.json(compras);
        } catch (error) {
            console.error('Error al parsear JSON de compras:', error);
            res.status(500).send('Error al procesar el archivo de compras');
        }
    });
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
