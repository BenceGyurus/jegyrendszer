from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import textwrap


def create_ticket(config, qr_code_id, customer_name, seat_number, show_title, location, start, price, seatName):
    pdf = canvas.Canvas(f"{config['PY_DIR']}/pdfs/{qr_code_id}.pdf", pagesize=letter)
    width = 3
    height = 5
    y = height
    pdf.setPageSize((width*inch, height*inch))

    # Jegy fejléce
    pdfmetrics.registerFont(TTFont('Tahoma', 'Tahoma.ttf'))
    pdf.setFont("Tahoma", 12)
    titleLine = textwrap.wrap(show_title, width=(((width) * inch))/10)
    y -= 0.5
    for line in titleLine:
        pdf.drawCentredString((width/2) * inch, y * inch, line)
        y -= 0.25

    # Logó hozzáadása
    logo_path = "media/fulllogo.png"
    logo_width = 0.8 * inch
    logo_height = 0.5 * inch
    pdf.drawInlineImage(logo_path, (width/2)* inch-(logo_width/2) , 0, width=logo_width, height=logo_height)

    # QR-kód hozzáadása
    qr_code_path = f"{config['PY_DIR']}/qrcodes/{qr_code_id}.png"
    qr_code_width = qr_code_height = 1.5 * inch

    # Jegy adatok elhelyezése
    data_x = (width/2-0.75) * inch
    data_y = (height-(4.5)) * inch

    # Jegy adatok
    pdf.setFont("Helvetica", 11)
    y-=0.5
    pdf.drawCentredString((width/2) * inch, y * inch, "Helyszín: ")
    y-=0.25
    pdf.drawCentredString(width/2 * inch, y * inch, location)
    y-=0.5
    pdf.drawCentredString((width/2) * inch, y * inch, "Esemény kezdete:")
    y-=0.25
    pdf.drawCentredString((width/2) * inch, y * inch, start)
    y-=((qr_code_height/inch)/2+1)
    pdf.drawInlineImage(qr_code_path, ((width/2)* inch)-(qr_code_width/2), y * inch, qr_code_width, qr_code_height)

    pdf.showPage()
    pdf.save()

# Jegy létrehozása
qr_code_data = "QR-kód adatok"
customer_name = "John Doe"
seat_number = "A12"
show_title = "Szerda esti akkusztik"
create_ticket(qr_code_data, customer_name, seat_number, show_title, "", "", "")

