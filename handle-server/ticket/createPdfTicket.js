const fs = require('fs');
const PDFDocument = require('pdfkit');
const qr = require('qrcode');

function createDateToString(date) {
    return `${date.y} ${date.month < 10 ? `0${date.month}` : date.month}. ${date.d < 10 ? `0${date.d}` : date.d}. ${date.h < 10 ? `0${date.h}` : date.h}:${date.m < 10 ? `0${date.m}` : date.m}`;
}

function autoSplit(text, doc, y, x, lineSize = 20, width = 300) {
    const words = text?.split(' ');
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
    isWardrobe,
    filePath
) {
    return new Promise(async (resolve, reject)=>{

        const stream = new require('stream').Writable({
            write(chunk, encoding, next) {
                buffer.push(chunk);
                next();
            },
        });

    const doc = new PDFDocument({ size: 'letter' });
    const buffer = [];
    const margin = 50; // Adjust this value as needed
    doc.page.margins = { top: margin, right: margin, bottom: margin, left: margin };

    doc.pipe(stream);

    //const logo = await loadImage('media/fulllogo.png');
    const logoWidth = 200;
    const logoHeight = 100;
    const logoX = (doc.page.width - logoWidth) / 2;
    const logoY = 0//doc.page.height - 100;
    let x = 50;
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

    const qrBuffer = await qr.toBuffer(ticket_id, { errorCorrectionLevel: 'L' });

    // Add the QR code image from the buffer to the PDF document
    doc.image(qrBuffer, doc.page.width - 200 - 20, logoY + 100, { width: 200, height: 200 });

    /* Jegy kódja */

    doc.font('media/fonts/Rubik/static/Rubik-Bold.ttf', 8).text(ticket_id, doc.page.width - 200 - 20 + 40, logoY + 290 - 10);
    y += 50;

    /* Jegy tájékoztató cím */

    const sizeOfUseTicketTitle = 12;
    doc.font('media/fonts/Rubik/static/Rubik-Bold.ttf', sizeOfUseTicketTitle).text('Jegy használata', 50, y);
    doc.lineWidth(1).moveTo(50 + (sizeOfUseTicketTitle / 1.7) * 'Jegy használata'.length, y + 8).lineTo(doc.page.width - 50, y + 3).stroke();

    /* Jegy tájékoztató*/

    y += 30;
    doc.font('media/fonts/Rubik/static/Rubik-Bold.ttf', 8);
    doc.text('Ez a jegyet hozd el magaddal a rendezvényre nyomtatott vagy digitális formában. Ügyelj arra, hogy a jegyen látható QR kódot és az alatta található azonosítót ne add meg senkinek és ne tedd ki közösségi oldalakra.', x, y);
    y += 30;

    /* Ruhatár */

    const wardrobeText = isWardrobe ? 'A helyszínen ruhatár működik' : 'A helyszínen ruhatár nem működik';
    doc.text(wardrobeText, 100 ,y,);
    y+= 30

    /* Általános szerződési feltételek */

    doc.font('media/fonts/Rubik/static/Rubik-Light.ttf', 5);
    const aszf = fs.readFileSync(`${__dirname}/ticketAszf.txt`, 'utf-8');
    doc.text(aszf, x, doc.page.height-100);


    
    stream.on('finish', () => {
        const resultBuffer = Buffer.concat(buffer);
        resolve(resultBuffer);
    });

    doc.end();

    });
}

module.exports = createTicket;