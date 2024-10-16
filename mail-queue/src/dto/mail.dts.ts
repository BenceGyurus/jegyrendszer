// @ Example usage
// {
//   "type": "TICKET" | "ACC_CONF",
//   "body": {
//     "name": "John Doe",
//     "fileName": ["ticket_1.pdf", "ticket_2.pdf"],
//     "tickets": [
//       {
//         "ticketName": "Előadás 1",
//         "ticketDate": "2020-01-01",
//         "ticketQty": 4,
//         "ticketType": "Normál"
//       },
//       {
//         "ticketName": "Előadás 1",
//         "ticketDate": "2020-01-01",
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
}

export class MailBody {
  readonly name?: string; // vevő neve
  readonly fileName: string[]; // jegy / jegyek pdfeinek nevei
  readonly tickets: Ticket[];
}
export class Ticket {
  readonly ticketName?: string; // előadás neve
  readonly ticketDate?: string | Date; // előadás dátuma
  readonly ticketType?: string; // jegy típusa (pl. álló, ülő)
  readonly ticketQty?: number; // jegy mennyiség
}
