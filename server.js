const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const PDFDocument = require('pdfkit');
const multer = require('multer');
const upload = multer();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generar-pdf', upload.none(), (req, res) => {
    const datosFormulario = req.body;

    const doc = new PDFDocument();
    const nombreArchivo = 'formulario.pdf';
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

    doc.pipe(res);

    doc.fontSize(12).text('Datos del formulario:', { underline: true });
    doc.fontSize(10);
    for (const key in datosFormulario) {
        if (datosFormulario.hasOwnProperty(key) && !key.startsWith('firma')) {
            doc.text(`${key}: ${datosFormulario[key]}`);
        }
    }

    // Agregar las firmas como imágenes
    if (datosFormulario.firma_supervisor