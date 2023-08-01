# -*- coding: utf-8 -*-
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def create_ticket(config, qr_code_id, customer_name, seat_number, show_title):
    
    # Jegy létrehozása
    ticket = canvas.Canvas(f"{config['PY_DIR']}/pdfs/{qr_code_id}.pdf", pagesize=letter)
    pdfmetrics.registerFont(TTFont('Tahoma', 'Tahoma.ttf'))
    ticket.setPageSize((7*inch, 3*inch))

    # Jegy tartalmának hozzáadása
    ticket.setFont("Tahoma", 12)
    ticket.drawString(0.5 * inch, 2.5 * inch, "Vásárló neve: {}".format(customer_name))
    ticket.drawString(0.5 * inch, 2 * inch, "Ülőhely: {}".format(seat_number))
    ticket.drawString(0.5 * inch, 1.5 * inch, "Előadás címe: {}".format(show_title))

    qr_img_path = f"{config['PY_DIR']}/qrcodes/{qr_code_id}.png"
    ticket.drawImage(qr_img_path, 4.5 * inch, 0.4 * inch, width=2.5 * inch, height=2.5 * inch)

    # Jegy mentése
    ticket.save()
    print("A jegy sikeresen létrejött.")

# Jegy létrehozása
create_ticket({"PY_DIR":"../data/email"}, qr_code_data, customer_name, seat_number, show_title)
