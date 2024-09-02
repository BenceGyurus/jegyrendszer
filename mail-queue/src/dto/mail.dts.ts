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
  readonly name?: string;
  readonly ticketName?: string;
  readonly ticketDate?: string | Date;
  readonly ticketType?: string;
  readonly ticketQty?: number;
  readonly fileName?: string;
}
