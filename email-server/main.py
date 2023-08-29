from flask import Flask, redirect, url_for, request, send_file
#from qrCode import *
from sendMail import *
#from ticket import *
from createTicket import *
#import time
import json
import os

app = Flask(__name__)
config = json.loads(open(f"{os.getenv('CONFIGDIR')}/config.json", "r", encoding = "utf8").read())

@app.route('/')
def hello(): 
    return 'hello world'

@app.route('/health', methods=['GET'])
def health(): 
    return 'working'

@app.route('/createCode', methods=['POST'])
async def createCode():
    request_data = request.get_json()
    print(request_data)
    ticket_Buffer = create_ticket(request_data["title"], request_data["nameOfTicket"], request_data["price"], request_data["id"], request_data["location"], request_data["start"], request_data["end"], request_data["open"], request_data["seat"], False)
    with open(f"{config['PY_DIR']}/{request_data['id']}.pdf", "wb") as f:
        f.write(ticket_Buffer.read())
    return send_file(f"{config['PY_DIR']}/{request_data['id']}.pdf", as_attachment=True)

if __name__ == "__main__":      
    # app.run(port=5000, host = "0.0.0.0")
    from waitress import serve
    serve(app, host="192.168.1.216", port=5000)

def create_app():
   return app