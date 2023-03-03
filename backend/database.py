import pymongo
from datetime import datetime
# --- local
import get_balance_api
# --- warning
import warnings
warnings.filterwarnings('ignore')
# ----
client = pymongo.MongoClient('127.0.0.1', 27017)
bufficorn_db = client.bufficorn
col_user_info = bufficorn_db.user_info
col_user_balance = bufficorn_db.user_balance


def user_login(address):
    user_exist = col_user_info.count_documents({'_id': address})
    if user_exist:
        print('[S] user {} exists.'.format(address))
        return 1
    else:
        new_data = {
            'since_time': datetime.now().__str__()
        }
        col_user_info.update_one({'_id': address}, {'$set': new_data}, upsert=True)
        print('[S] user {} register success.'.format(address))
        return 1


def user_get_balance(address):
    tokens = get_balance_api.get_user_tokens(address)
    result_tokens = []
    for token in tokens:
        db_id = address + '_' + token['id']
        latest_token = {
            'symbol': token['attributes']['fungible_info']['symbol'],
            'amount': token['attributes']['quantity']['float'],
            'value_usd': token['attributes']['value'],
            'price': token['attributes']['price'],
            'changes_percent_1d': token['attributes']['changes']['percent_1d'],
            'updated_at': token['attributes']['updated_at']
        }
        # --- frontend res
        result_tokens.append(latest_token)
        # --- stored in db
        col_user_balance.update_one({'_id': db_id}, {'$set': latest_token}, upsert=True)
    return result_tokens

