# -*- coding: utf-8 -*-

import flask
from flask import request
from flask_cors import *
import argparse
import json
# --- local
import utils
import database
# --- warning
import warnings
warnings.filterwarnings('ignore')
# --- setting argparser ---
parser = argparse.ArgumentParser(prog='Flask API for Ting Museum',
                                 usage='[optionals] Example: python3 main.py')
parser.add_argument('--host', metavar='', type=str, default='localhost', help='Input localhost or host X.X.X.X')
args, unknown = parser.parse_known_args()
# ---
HOST = '0.0.0.0' if args.host == 'localhost' else args.host.lower()
server = flask.Flask(__name__, static_folder=utils.DB_PATH)
CORS(server, supports_credetials=True)

@server.route("/address_risk", methods=['GET'])
def address_risk():
    return flask.Response(status=200, response=json.dumps({'message': 'login success.', 'status': 1}))

# @server.route("/user_login", methods=['POST'])
# def user_login():
#     data = request.get_json()
#     user_address = utils.checkSumAddress(data['user_address'])
#     database.user_login(user_address)
#     return flask.Response(status=200, response=json.dumps({'message': 'login success.', 'status': 1}))
#
#
# @server.route("/user_balance", methods=['POST'])
# def user_balance():
#     data = request.get_json()
#     user_address = utils.checkSumAddress(data['user_address'])
#     tokens = database.user_get_balance(user_address)
#     return flask.Response(status=200, response=json.dumps({'user_tokens': tokens, 'status': 1}))


if __name__ == '__main__':
    server.run(host=HOST, port=8700, debug=True, threaded=True)






