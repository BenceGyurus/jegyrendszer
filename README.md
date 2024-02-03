# API Documentaion
## Open API
### Events:
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
| performer  | `Array<{ name : string, price : number }>`  | megvásárolható jegyek az eseményhez | 