import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.message import EmailMessage
from email.mime.image import MIMEImage
import os

def sendMail(receiver_address, imagename):
    # message = EmailMessage()
    
    message = MIMEMultipart('related')
    message['From'] = os.getenv('PY_MAIL')
    message['To'] = receiver_address

    sender_pass = os.getenv('PY_PASS')
    sender_pass = "nbdcecfzxgcbnzbe"


    message['Subject'] = f'Jegy. It has an attachment.'  # TODO targy
    mail_body = "ide majd irsz vmi fasza szoveget gyurus" # TODO body

    message.attach(MIMEText(mail_body, 'plain'))

    with open(f"./qrcodes/{imagename}.png", 'rb') as attachment:
        part = MIMEImage(attachment.read(), name=f"{imagename}.png")
        part.add_header('Content-Disposition', f'attachment; filename={imagename}.png')
        message.attach(part)
    

    session = smtplib.SMTP('smtp.gmail.com', 587)
    session.starttls()
    session.login(message['From'], sender_pass)
    text = message.as_string()
    session.sendmail(message['From'], message['To'], text)
    session.quit()
