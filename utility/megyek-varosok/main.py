import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["country"]
states = mydb["states"]
cities = mydb["cities"]


states = {
    'BK':'Bács-Kiskun',
    'BE':'Békés',
    'BA':'Baranya',
    'BZ':'Borsod-Abaúj-Zemplén',
    'BU':'Budapest',
    'CS':'Csongrád',
    'FE':'Fejér',
    'GS':'Győr-Moson-Sopron',
    'HB':'Hajdú-Bihar',
    'HE':'Heves',
    'JN':'Jász-Nagykun-Szolnok',
    'KE':'Komárom-Esztergom',
    'NO':'Nógrád',
    'PE':'Pest',
    'SO':'Somogy',
    'SZ':'Szabolcs-Szatmár-Bereg',
    'TO':'Tolna',
    'VA':'Vas',
    'VE':'Veszprém',
    'ZA':'Zala',
    'I.': 'Budapest',
    'II.': 'Budapest',
    'III.': 'Budapest',
    'IV.': 'Budapest',
    'V.': 'Budapest',
    'VI.': 'Budapest',
    'VII.': 'Budapest',
    'VIII.': 'Budapest',
    'IX.': 'Budapest',
    'X.': 'Budapest',
    'XI.': 'Budapest',
    'XII.': 'Budapest',
    'XIII.': 'Budapest',
    'XIV.': 'Budapest',
    'XV.': 'Budapest',
    'XVI.': 'Budapest',
    'XVII.': 'Budapest',
    'XVIII.': 'Budapest',
    'XIX.': 'Budapest',
    'XX.': 'Budapest',
    'XXI.': 'Budapest',
    'XXII.': 'Budapest',
    'XXIII.': 'Budapest',
}

with open('telepulesek.txt', 'r', encoding='utf-8') as f:
    for line in f.readlines():
        sor = line.strip().split()
        if not cities.find_one({'city' : sor[1]}):
            cities.insert_one({
                'zip': sor[0],
                'city': sor[1],
                'state': states[sor[2]]
            })
            print(f"[INSERTED]: {sor[1]}")
# x = states.insert_one()
