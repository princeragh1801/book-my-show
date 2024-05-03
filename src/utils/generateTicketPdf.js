import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateTicketPDF({ eventName, eventDate, eventTime, venue, ticketNumber }) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 14;
    const lineHeight = 20;

    const drawText = (text, options) => {
        page.drawText(text, { ...options, font: helveticaFont, size: fontSize });
    };

    const drawHeading = (text, y) => {
        drawText(text, {
            x: 50,
            y: y,
            color: rgb(0, 0, 0),
        });
    };

    const drawDetail = (label, value, y) => {
        drawText(`${label}: ${value}`, {
            x: 50,
            y: y,
            color: rgb(0, 0, 0),
        });
    };

    drawHeading('Ticket Details', height - 50);
    drawDetail('Event', eventName, height - 80);
    drawDetail('Date', eventDate, height - 100);
    drawDetail('Time', eventTime, height - 120);
    drawDetail('Venue Name', venue.name, height - 140);
    drawDetail('Address', venue.address, height - 160);
    drawDetail('City', venue.city, height - 180);
    if (venue.state) {
        drawDetail('State', venue.state, height - 200);
    }
    drawDetail('Country', venue.country, height - (venue.state ? 220 : 200));
    drawDetail('Capacity', venue.capacity, height - (venue.state ? 240 : 220));
    drawDetail('Ticket Number', ticketNumber, height - (venue.state ? 260 : 240));

    // Save the PDF to a buffer
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
