const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/submit_timesheet', (req, res) => {
    const { name, entries } = req.body;
    // Di sini Anda bisa mengolah data, misalnya menyimpannya ke database
    console.log('Received timesheet:', name, entries);
    res.json({ message: 'Timesheet submitted successfully!' });
});

app.post('/download_pdf', (req, res) => {
    const { name, entries } = req.body;
    const doc = new PDFDocument();
    let filename = `timesheet_${Date.now()}.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.text(`Timesheet for ${name}\n\n`, {
        align: 'center'
    });

    entries.forEach(entry => {
        doc.text(`Date: ${entry.date}\nStart Hour: ${entry.start_hour}\nEnd Hour: ${entry.end_hour}\nActivity: ${entry.activity}\nRemarks: ${entry.remarks}\n\n`);
    });

    doc.pipe(res);
    doc.end();
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
