import requests
import json
import time
address = '0x5c6eb9fdb3ff265d687636769c20ae9b804eb339'
key = json.load(open('keys/private.json', 'r'))['zerion_api']
headers = {
    "accept": "application/json",
    "authorization": key
}


def get_user_tokens(address):
    url = ("https://api.zerion.io/v1/wallets/{}/positions/?currency=usd&sort=value".format(address)).lower()
    while True:
        r = requests.get(url, headers=headers)
        if r.status_code == 200:
            tokens = r.json()['data']
            print('[S] zerion found {} tokens @{}'.format(len(tokens), address))
            return tokens
            break
        else:
            print('[S] zerion api status code {}..please wait..'.format(r.status_code))
            time.sleep(2)



