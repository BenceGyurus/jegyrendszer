from reportlab.lib.pagesizes import portrait
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.platypus.tables import Table, TableStyle
import random
from datetime import datetime
import json
import os
from PIL import Image as PILImage


def create_ticket(config, qr_code_id, seat_number, show_title, location, start, price):
    config = json.loads(open(f"{os.getenv('CONFIGDIR')}/config.json", "r", encoding = "utf8").read())
    if (config):
        page_width = config["SEND_PDF_WIDTH"]
        page_height = config["SEND_PDF_HEIGHT"]
        left_margin = config["PDF_LEFT_MARGIN"]
        right_margin = config["PDF_RIGHT_MARGIN"]
        top_margin = config["PDF_TOP_MARGIN"]
        bottom_margin = config["PDF_BOTTOM_MARGIN"]
        doc = SimpleDocTemplate(f"{config['PY_DIR']}/{qr_code_id}.pdf", pagesize=(page_width, page_height),
                            leftMargin=left_margin,
                            rightMargin=right_margin,
                            topMargin=top_margin,
                            bottomMargin=bottom_margin)
        from reportlab.pdfbase.ttfonts import TTFont
        from reportlab.pdfbase import pdfmetrics
        lato_font_path = config["PDF_FONT_FAMILY"] #"media/fonts/Rubik/static/Rubik-Regular.ttf"  # Replace "path_to_lato_font" with the actual path
        pdfmetrics.registerFont(TTFont('Lato', lato_font_path))
        normal_style = ParagraphStyle('NormalStyle', fontSize=14, textColor=colors.black, leading=18, alignment=0, fontName='Lato')
        normal_style_title = ParagraphStyle('NormalStyle', fontSize=10, textColor=colors.grey, leading=18, alignment=0, fontName='Lato')
        title_color = colors.HexColor(config["PDF_TITLE_COLOR"])
        body_color = colors.HexColor(config["PDF_BODY_COLOR"])
        ticket_content = [
        # Title
        Image(f"{config['PY_DIR']}/{qr_code_id}.png", width=config["QR_CODE_SIZE"], height=config["QR_CODE_SIZE"]),

        # Event details
        Paragraph("Esemény:".upper(), normal_style_title),
        Paragraph(show_title.upper(), normal_style),
        Spacer(1, 0.1 * inch),
        Paragraph("Esemény helye:".upper(), normal_style_title),
        Paragraph(location.upper(), normal_style),
        Spacer(1, 0.1 * inch),
        Paragraph("Kezdés:".upper(), normal_style_title),
        Paragraph(start.upper(), normal_style),
        Spacer(1, 0.1 * inch),
        Paragraph("Jegy ára:".upper(), normal_style_title),
        Paragraph(f"{price}Ft".upper(), normal_style),
        Spacer(1, 0.1 * inch),
        ]
        if (seat_number):
            ticket_content.append(Paragraph("Ülőhely:".upper(), normal_style_title))
            ticket_content.append(Paragraph(seat_number.upper(), normal_style))

        doc.build(ticket_content)
        return f"{config['PY_DIR']}/{qr_code_id}.pdf"
    return False


