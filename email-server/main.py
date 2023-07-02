from flask import Flask, redirect, url_for, request
from qrCode import *
from sendMail import *
from createPdf import *
import time

app = Flask(__name__)

@app.route('/')
def hello(): 
    return 'hello world'

@app.route('/createCode', methods=['POST'])
async def createCode():
    request_data = request.get_json()
    qr = QrCode()
    qr.create(request_data['id'])
    time.sleep(10)
    sendMail(request_data['email'], request_data['id'])
    return '201'
        

app.run(debug=True, port=5000)