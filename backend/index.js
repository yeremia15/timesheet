const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/submit_timesheet', (req, res) => {
    const {
        name,
        entries
    } = req.body;
    // Di sini Anda bisa mengolah data, misalnya menyimpannya ke database
    console.log('Received timesheet:', name, entries);
    res.json({
        message: 'Timesheet submitted successfully!'
    });
});

app.post('/download_pdf', (req, res) => {
    const {
        name,
        entries
    } = req.body;
    const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
    });
    let filename = `timesheet_${Date.now()}.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    // Judul Timesheet
    doc.fontSize(20).font('Helvetica-Bold').text(`Professional Services - Timesheet`, {
        align: 'center'
    });
    doc.moveDown(1);

    // Header Timesheet

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    const startDateString = `${startDate.getDate()}-${currentMonth + 1}-${currentYear}`;
    const endDateString = `${endDate.getDate()}-${currentMonth + 1}-${currentYear}`;
    doc.fontSize(14).font('Helvetica-Bold').text('Duration:', {
        align: 'left'
    });
    doc.fontSize(14).font('Helvetica').text(`[${startDateString}] - [${endDateString}]`, {
        align: 'left',
        x: 100
    });
    doc.moveDown(0.5);

    doc.fontSize(14).font('Helvetica-Bold').text('Nama:', {
        align: 'left'
    });
    doc.fontSize(14).font('Helvetica').text(name, {
        align: 'left',
        x: 100
    });
    doc.moveDown(0.5);

    doc.fontSize(14).font('Helvetica-Bold').text('Client:', {
        align: 'left'
    });
    doc.fontSize(14).font('Helvetica').text('PT Pegadaian', {
        align: 'left',
        x: 100
    });
    doc.moveDown(1);

    // Tabel Timesheet
    doc.fontSize(12).font('Helvetica-Bold').text('Tanggal', {
        align: 'left',
        width: 100
    });
    doc.fontSize(12).font('Helvetica-Bold').text('Hari', {
        align: 'left',
        width: 100,
        x: 120
    });
    doc.fontSize(12).font('Helvetica-Bold').text('Start Hour', {
        align: 'left',
        width: 100,
        x: 240
    });
    doc.fontSize(12).font('Helvetica-Bold').text('End Hour', {
        align: 'left',
        width: 100,
        x: 360
    });
    doc.fontSize(12).font('Helvetica-Bold').text('Activity', {
        align: 'left',
        width: 200,
        x: 480
    });
    doc.fontSize(12).font('Helvetica-Bold').text('Remarks', {
        align: 'left',
        width: 200,
        x: 680
    });
    doc.moveDown(1);

    entries.forEach((entry, index) => {
        doc.fontSize(12).font('Helvetica')
            .text(entry.date, {
                align: 'left',
                width: 100
            })
            .text(entry.day, {
                align: 'left',
                width: 100,
                x: 120
            })
            .text(entry.start_hour, {
                align: 'left',
                width: 100,
                x: 240
            })
            .text(entry.end_hour, {
                align: 'left',
                width: 100,
                x: 360
            })
            .text(entry.activity, {
                align: 'left',
                width: 200,
                x: 480
            })
            .text(entry.remarks, {
                align: 'left',
                width: 200,
                x: 680
            });
        doc.moveDown(0.5);
    });

    doc.pipe(res);
    doc.end();
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});