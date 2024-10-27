// @ Example usage
// {
//   "type": "TICKET" | "ACC_CONF",
//   "body": {
//     "name": "John Doe",
//     "fileName": ["ticket_1.pdf", "ticket_2.pdf"],
//     "event": {
//       "eventName": "Előadás 1",
//       "eventDate": "2021-01-01",
//       "eventLocation": "Budapest",
//       "eventHref": "eloadas-1"
//     },
//     "tickets": [
//       {
//         "ticketName": "Előadás 1",
//         "ticketQty": 4,
//         "ticketType": "Normál"
//       },
//       {
//         "ticketName": "Előadás 1",
//         "ticketQty": 8,
//         "ticketType": "VIP"
//       }
//     ]
//   },
//   "recip": "test@gmail.com"
// }

export class MailDTO {
  readonly type: MailTypes;
  readonly body: MailBody;
  readonly recip: string;
}

export enum MailTypes {
  TICKET = 'ticket',
  ACC_CONF = 'acc_conf',
  DEBUG = 'debug',
}

export class MailBody {
  readonly name?: string; // vevő neve
  readonly fileName: string[]; // jegy / jegyek pdfeinek nevei
  readonly event: Event;
  readonly tickets: Ticket[];
}
export class Ticket {
  readonly ticketName?: string; // előadás neve
  readonly ticketType?: string; // jegy típusa (pl. álló, ülő)
  readonly ticketQty?: number; // jegy mennyiség
}

export class Event {
  readonly eventName: string; // esemény neve
  readonly eventDate: string | Date; // esemény dátuma
  readonly eventLocation: string; // esemény helyszíne
  readonly eventHref: string; // esemény linkje | https://jegy-agorasavaria.hu/rendezveny/{{eventHref}}
}
