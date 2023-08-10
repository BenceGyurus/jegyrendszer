import json
import os


def openConfig():
    config = json.loads(open(f"/config.json", "r", encoding = "utf8").read())