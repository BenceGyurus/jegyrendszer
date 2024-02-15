# ARCHIVED

## THIS PROJECT HAVE BEEN ARCHIVED FOR AN UNKWOND PREIOD OF TIME

## TEST RUN

- run handle server
`cd handle-server && npm install && node index.js`

- run web server
`cd web-server && npm install && npm start`

- handle server host:
`localhost:3001`

- web server host:
`localhost:3000`

- redish host:
editable in `handle-server/index.js` file

- mongodb host:
editbale in `./config.json` file

- **The App have never been test on other os except on ios**

- admin default login
username : admin
password : admin

**The whole application includes several issues and bugs**



# API Documentaion
## Open API
### Events:
`GET`

```api/v1/events```
```[
    {
        id : string,
        date : string,
        title : string,
        description : string,
        imageName : string,
        address : string,
        location : string,
        positions : {
            lat : number,
            lng : number
        },
        end : string,
        organiser : {
            name : string,
            website : string
        },
        performer : {
            name : string
            isGroupPerformer : boolean
        },
        tickets : [
            {
                name : string,
                price : number
            }
        ]
    }
]
```
| key  | type | desciption |
| ------------- | ------------- | ------------- |
| id  | `string`  | esemény id-ja |
| date  | `string`  | esemény kezdetének időpontja e.g "2024-05-05T15:00" |
| description  | `string`  | esemény leírása |
| imageName  | `string`  | az esemény borítójának az url-e |
| address  | `string`  | az esemény helyszínének a címe |
| location  | `string`  | az esemény helyszínének a neve pl. AGORA MSH |
| position  | `{ lat : number, lng : number }`  | az esemény helyszínének a koordinátája |
| end  | `string`  | esemény vége |
| organiser  | `{ name : string, website : string }`  | az esemény szervezője |
| performer  | `{ name : string, isGroupPerformer : string }`  | az eseény szereplő(i) |
| tickets  | `Array<{ name : string, price : number }>`  | megvásárolható jegyek az eseményhez |

### Event
`GET`

`/api/v1/event/:readable-id`
```
{
    media : {
        spotify? : string,
        youtube? : string,
        facebook? : string,
        apple_music? : string
    },
    id : string,
    background : string,
    title : string,
    description : string,
    date : Date,
    location : string,
    position : {
        lat : number
        lng : number
    },
    address : string,
    venue : string
}
```

| key  | type | desciption |
| ------------- | ------------- | ------------- |
| media  | `{ spotify? : string, youtube? : string, facebook? : string, apple_music? : string }`  | esemény média platformjai |
| date  | `string`  | esemény kezdetének időpontja e.g "2024-05-05T15:00" |
| description  | `string`  | esemény leírása |
| background  | `string`  | az esemény borítójának az url-e |
| address  | `string`  | az esemény helyszínének a címe |
| location  | `string`  | az esemény helyszínének a neve pl. AGORA MSH |
| position  | `{ lat : number, lng : number }`  | az esemény helyszínének a koordinátája |
| id  | `string`  | esemény azonosítója |
| title  | `string`  | az esemény neve |
| venue  | `string`  | terem azonosítója |

### Tickets to the event

`GET`


`/api/v1/tickets/:readable-id`

- Params:

| name | value | description |
| ------------- | ------------- | ------------- |
| reserved | boolean | foglalt helyek |

```
Array<{
    name : string,
    price : number,
    seats : Array<string> // ids of seats
    numberOfTicket : number,
    id : string,
    pendingPlaces : Array<string>   // reserved == true
    boughtPlaces : Array<string>
    numberOfFreeTickets : number
}>
```

| key | type | description |
| ------------- | ------------- | ------------- |
| name | `string` | jegy neve |
| price | `number` | jegy ára |
| seats | `Array [string]` | a jegyhez tartozó ülőhelyek id-ja |
| numberOfTicket | `number` | az összes jegy száma |
| id | `string` | jegy id-ja |
| pendingPlaces | `Array [string]` | a vásárlás alatt álló ülőhelyek id-ja |
| boughtPlaces | `Array [string]` | már megvásárolt ülőhelyek id-ja |
| numberOfFreeTickets | `number` | megvásárolható jegyek száma |
