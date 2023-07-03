from email import encoders
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.message import EmailMessage
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase
import os

def sendMail(receiver_address, imagename, email_subject, email_body, config):
    # message = EmailMessage()
    
    message = MIMEMultipart('related')
    message['From'] = config['PY_MAIL']
    message['To'] = receiver_address

    sender_pass = config['PY_PASS']


    message['Subject'] = f'Jegy - {email_subject}'
    mail_body = email_body

    message.attach(MIMEText(mail_body, 'plain'))

    # with open(f"{config['PY_DIR']}/qrcodes/{imagename}.png", 'rb') as attachment:
    #     part = MIMEImage(attachment.read(), name=f"{imagename}.png")
    #     part.add_header('Content-Disposition', f'attachment; filename={imagename}.png')
    #     message.attach(part)
    with open(f"{config['PY_DIR']}/pdfs/{imagename}.pdf", 'rb') as attachment:
        part = MIMEBase('application', 'pdf')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename= {imagename}.pdf')
        message.attach(part)
    

    session = smtplib.SMTP('smtp.gmail.com', 587)
    session.starttls()
    session.login(message['From'], sender_pass)
    text = message.as_string()
    session.sendmail(message['From'], message['To'], text)
    session.quit()
