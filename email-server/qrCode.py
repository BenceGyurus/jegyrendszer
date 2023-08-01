import qrcode
from PIL import Image
import random
import json


class QrCode:
    # def __init__(self):
    #     try:
    #         self.config = json.loads(open("qrcodeconfig.json", "r", encoding = "utf8").read())
    #         if self.config:
    #             self.logo = self.config["logo"]
    #     except:
    #         pass

    def create(self,data,config):
        if data:
            logo_file_name = "media/logo.png"
            qr_code = qrcode.QRCode(
                error_correction=qrcode.constants.ERROR_CORRECT_H
            )
            qr_code.add_data(data)
            qr_code.make()
            qr_code_image = qr_code.make_image().convert("RGB")
            logo = Image.open('./media/logo.png')
            logo_x_position = (qr_code_image.size[0] - logo.size[0]) // 2
            logo_y_position = (qr_code_image.size[1] - logo.size[1]) // 2
            logo_position = (logo_x_position, logo_y_position)
            qr_code_image.paste(logo, logo_position)

            qr_code_image.save(f"{config['PY_DIR']}/qrcodes/{data}.png")

            

logo_file_name = "media/logo.png
data_to_encode = str(random.randint(10000000,99999999))


