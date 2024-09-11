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
  readonly fileName?: string | string[]; // jegy / jegyek pdfeinek nevei
  readonly tickets: Ticket[];
}
export class Ticket {
  readonly ticketName?: string; // előadás neve
  readonly ticketDate?: string | Date; // előadás dátuma
  readonly ticketType?: string; // jegy típusa (pl. álló, ülő)
  readonly ticketQty?: number; // jegy mennyiség
}
