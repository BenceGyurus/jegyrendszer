const fs = require('fs');
const PDFDocument = require('pdfkit');
//const qr = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const qr = require('qrcode');

function autoSplit(text, doc, y, x, lineSize = 20, width = 300) {
    const words = text.split(' ');
    let currentLine = words[0];
    const lines = [];

    for (let i = 1; i < words.length; i++) {
        if (doc.widthOfString(currentLine + ' ' + words[i]) <= width) {
            currentLine += ' ' + words[i];
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);

    for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], x, y + i * lineSize);
    }

    y += lines.length * lineSize;
    return y;
}

// Function to create the PDF ticket
async function createTicket(
    event_title,
    ticket_name,
    ticket_price,
    ticket_id,
    location,
    start,
    end,
    gateOpen,
    seatName,
    isWardrobe
) {
    const doc = new PDFDocument({ size: 'letter' });
    const buffer = [];

    doc.pipe(fs.createWriteStream('ticket.pdf'));

    //const logo = await loadImage('media/fulllogo.png');
    const logoWidth = 200;
    const logoHeight = 100;
    const logoX = (doc.page.width - logoWidth) / 2;
    const logoY = 0//doc.page.height - 100;
    let x = 100;
    let y = logoY;

    const imageBuffer = fs.readFileSync('media/fulllogo.png');
    doc.image(imageBuffer, logoX, logoY, { width: logoWidth, height: logoHeight });

    //doc.image(logo, logoX, logoY, { width: logoWidth, height: logoHeight });

    doc.font('media/fonts/Rubik/static/Rubik-Bold.ttf', 30).fillColor('black');
    y = autoSplit(event_title, doc, logoY + 100, 50, 30);
    console.log(y)

    doc.font('media/fonts/Rubik/static/Rubik-Bold.ttf', 11).text(ticket_name, 50, y += 10);
    if (seatName) {
        doc.text(seatName, 50, y += 17);
    }
    doc.text(`Ár: ${ticket_price}Ft`, 50, y += 17);
    y += 25;
    doc.font('media/fonts/Rubik/static/Rubik-Light.ttf', 10);
    y = autoSplit(location, doc, y, 50);
    doc.text(`Kezdés: ${createDateToString(start)}`, 50, y += 20);
    doc.text(`Vége: ${createDateToString(end)}`, 50, y += 20);
    doc.text(`Kapunyitás: ${createDateToString(gateOpen)}`, 50, y += 20);

    const qrDataURL = await qr.toDataURL(ticket_id, { errorCorrectionLevel: 'L' });

// Remove the data URL prefix and convert to a buffer
    const dataUrlParts = qrDataURL.split(',');
    const imageData = Buffer.from(dataUrlParts[1], 'base64');

// Write the buffer to a PNG file
    fs.writeFileSync('qrCode.png', imageData);
    const qrImage = fs.readFileSync('qrCode.png');
    doc.image(qrImage, doc.page.width - 200 - 20, logoY + 100, { width: 200, height: 200 });

    doc.font('media/fonts/Rubik/static/Rubik-Bold.ttf', 8).text(ticket_id, doc.page.width - 200 - 20 + 40, logoY + 220 - 10);

    y += 50;

    const sizeOfUseTicketTitle = 12;
    doc.font('media/fonts/Rubik/static/Rubik-Bold.ttf', sizeOfUseTicketTitle).text('Jegy használata', 50, y);
    doc.lineWidth(1).moveTo(50 + (sizeOfUseTicketTitle / 1.7) * 'Jegy használata'.length, y + 3).lineTo(doc.page.width - 50, y + 3).stroke();

    y += 30;
    doc.font('media/fonts/Rubik/static/Rubik-Bold.ttf', 8);
    /*y = autoSplit(
        'Ez a jegyet hozd el magaddal a rendezvényre nyomtatott vagy digitális formában. Ügyelj arra, hogy a jegyen látható QR kódot és az alatta található azonosítót ne add meg senkinek és ne tedd ki közösségi oldalakra.',
        doc,
        y,
        50,
        13,
        doc.page.width - 100
    );*/
    doc.text('Ez a jegyet hozd el magaddal a rendezvényre nyomtatott vagy digitális formában. Ügyelj arra, hogy a jegyen látható QR kódot és az alatta található azonosítót ne add meg senkinek és ne tedd ki közösségi oldalakra.', x, y);
    y += 30;
    const wardrobeText = isWardrobe ? 'A helyszínen ruhatár működik' : 'A helyszínen ruhatár nem működik';
    y = autoSplit(wardrobeText, doc, y, 50, 12, doc.page.width - 100);

    doc.font('media/fonts/Rubik/static/Rubik-Light.ttf', 5);
    const aszf = fs.readFileSync('ticketAszf.txt', 'utf-8');
    autoSplit(aszf, doc, doc.page.height-100, 50, 8, doc.page.width - 100);

    doc.addPage();
    doc.end();

    return buffer;
}

// Helper function to create a date string
function createDateToString(date) {
    return `${date.y} ${date.month}. ${date.d}. ${date.h}:${date.m}`;
}

let testDatas = {
    event_title: "Awesome Event",
    ticket_name: "VIP Ticket",
    ticket_price: 1000,
    ticket_id: "TICKET123",
    location: "Event Venue",
    start: { y: 2023, month: "Aug", d: 28, h: 14, m: 0 },
    end: { y: 2023, month: "Aug", d: 28, h: 18, m: 0 },
    gateOpen: { y: 2023, month: "Aug", d: 28, h: 13, m: 30 },
    seatName: "A1",
    isWardrobe: true
}

// Usage
createTicket(testDatas.event_title, testDatas.ticket_name, testDatas.ticket_price, testDatas.ticket_id, testDatas.location, testDatas.start, testDatas.end, testDatas.gateOpen, testDatas.seatName, testDatas.isWardrobe);
