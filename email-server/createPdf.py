# -*- coding: utf-8 -*-
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def create_ticket(qr_code_data, customer_name, seat_number, show_title):
    # Jegy létrehozása
    ticket = canvas.Canvas("ticket.pdf", pagesize=letter)
    pdfmetrics.registerFont(TTFont('Tahoma', 'Tahoma.ttf'))
    ticket.setPageSize((7*inch, 3*inch))

    # Jegy tartalmának hozzáadása
    ticket.setFont("Tahoma", 12)
    ticket.drawString(0.5 * inch, 2.5 * inch, "Vásárló neve: {}".format(customer_name))
    ticket.drawString(0.5 * inch, 2 * inch, "Ülőhely: {}".format(seat_number))
    ticket.drawString(0.5 * inch, 1.5 * inch, "Vásárló neve: {}".format(show_title))

    qr_img_path = "qrcodes/code1.png"
    ticket.drawImage(qr_img_path, 4.5 * inch, 0.4 * inch, width=2.5 * inch, height=2.5 * inch)

    # Jegy mentése
    ticket.save()
    print("A jegy sikeresen létrejött.")

# Tesztadatok
qr_code_data = "https://example.com"
customer_name = "John Doe"
seat_number = "Földszint jobb II.sor 1.szék"
show_title = "Csodálatos Előadás"

# Jegy létrehozása
create_ticket(qr_code_data, customer_name, seat_number, show_title)
