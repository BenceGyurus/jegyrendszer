from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
import qrcode
from PIL import Image
from io import BytesIO
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def autoSplit(text, c, y, x, lineSize=20, width=300):
    lines = []
    words = text.split()
    current_line = words[0]
    for word in words[1:]:
        if c.stringWidth(current_line + ' ' + word) <= width:
            current_line += ' ' + word
        else:
            lines.append(current_line)
            current_line = word
    lines.append(current_line)

    for i, line in enumerate(lines):
        c.drawString(x, (y - (i*lineSize)), line)

    y -= (len(lines))*lineSize

    return y

def createDateToString(date):
    return f"{date['y']} {date['month']}. {date['d']}. {date['h']}:{date['m']}"

# Function to create the PDF ticket
def create_ticket(event_title, ticket_name, ticket_price, ticket_id, location, start, end, gateOpen, seatName, isWardrobe):
    normal_Font_Path = "media/fonts/Rubik/static/Rubik-Light.ttf"  # Replace with the path to your custom font file
    normal = "Lato-Black"  # Replace with the desired font name
    bold_Font_Path = "media/fonts/Rubik/static/Rubik-Bold.ttf"
    bold = "Lato-Bold"

    pdfmetrics.registerFont(TTFont(normal, normal_Font_Path))
    pdfmetrics.registerFont(TTFont(bold, bold_Font_Path))
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    x = 50

    # Add a logo centered above the header
    logo_path = "media/fulllogo.png"
    logo_width = 200
    logo_height = 100
    logo_x = (letter[0] - logo_width) / 2
    logo_y = letter[1] - 100
    c.drawImage(logo_path, logo_x, logo_y, width=logo_width, height=logo_height)

    # Event title
    c.setFont(bold, 30)
    c.setFillColor(colors.black)
    y = autoSplit(event_title,c ,logo_y-50, x, lineSize=30)
    #c.drawString(x, logo_y - 50, event_title)


    # Ticket name and price
    c.setFont(bold, 11)
    y-=-10
    c.drawString(x, y, ticket_name)
    if seatName:
        y-=17
        c.drawString(x, y,seatName)
    y-=17
    c.drawString(x, y,"Ár: "+str(ticket_price)+"Ft")
    y-=25
    c.setFont(normal, 10)
    y = autoSplit(location, c, y, x)
    c.drawString(x, y,"Kezdés: "+createDateToString(start))
    y-=20
    c.drawString(x, y,"Vége: "+createDateToString(end))
    y-=20
    c.drawString(x, y,"Kapunyitás: "+createDateToString(gateOpen))

    # Generate and place QR code on the right side
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=30,
        border=4,
    )
    qr.add_data(ticket_id)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_buffer = BytesIO()
    qr_img.save(qr_buffer, format="PNG")

    # Convert QR code BytesIO to PIL image
    qr_pil_image = Image.open(qr_buffer)

    # Draw PIL image on the canvas
    qr_x = letter[0] - 200 - 20 # Positioned on the right side
    qr_y = logo_y - 220
    c.drawInlineImage(qr_pil_image, qr_x, qr_y, width=200, height=200)

    # Ticket ID
    c.setFont(bold, 8)
    c.drawString(qr_x+40, qr_y+10 , ticket_id)

    y-=50

    #Jegy használata Title
    sizeOfUseTicketTitle = 12
    c.setFont(bold, sizeOfUseTicketTitle)
    c.drawString(x, y,"Jegy használata")
    c.setStrokeColor(colors.black)
    c.setLineWidth(1)
    c.line(x+(sizeOfUseTicketTitle/1.7)*len("Jegy használata"), y+3, letter[0]-x, y+3)

    y-=30
    c.setFont(bold, 8)
    y = autoSplit("Ez a jegyet hozd el magaddal a rendezvényre nyomtatott vagy digitális formában. Ügyelj arra, hogy a jegyen látható QR kódot és az alatta található azonosítót ne add meg senkinek és ne tedd ki közösségi oldalakra.", c, y, x, lineSize = 13, width = letter[0]-2*x)
    y-=10
    wardrobeText = "A helyszínen ruhatár nem működik"
    if isWardrobe:
        wardrobeText ="A helyszínen ruhatár működik"
    y = autoSplit(wardrobeText, c, y, x, lineSize=12, width=letter[0]-(2*x))

    c.setFont(normal, 5)

    aszf = open("ticketAszf.txt", "r" ,encoding = "utf-8").read()

    autoSplit(aszf, c, 50, x,8,letter[0]-(2*x) )

    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer


