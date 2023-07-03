from flask import Flask, redirect, url_for, request
from qrCode import *
from sendMail import *
from ticket import *
import time

app = Flask(__name__)
config = json.loads(open(f"{os.getenv('CONFIGDIR')}/config.json", "r", encoding = "utf8").read())

@app.route('/')
def hello(): 
    return 'hello world'

@app.route('/createCode', methods=['POST'])
async def createCode():
    request_data = request.get_json() 
    qr = QrCode()
    qr.create(request_data['id'], config)
    print(f"creating ticket for {request_data['id']} with email {request_data['email']}")
    create_ticket(config, request_data['id'], request_data['name'], request_data['seat'], request_data['title'], request_data['location'], request_data['start'])
    time.sleep(10)
    if request_data['local'] is False: sendMail(request_data['email'], request_data['id'], request_data['title'], request_data['email_body'], config)
    return f"{request_data['id']}.png"
        
app.run(debug=True, port=5000)