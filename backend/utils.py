import os
from web3 import Web3
# ---
parent_dir = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
db_dir = 'bufficornDB'
DB_PATH = '''{}/{}/'''.format(parent_dir, db_dir)
# ---


def checkSumAddress(addr):
    try:
        return Web3.toChecksumAddress(addr)
    except TypeError as e:
        print('[ERROR] address format error ---> {}.'.format(addr))


