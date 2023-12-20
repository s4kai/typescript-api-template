import { Account } from "./account";
import { Entity } from "./base_entity";

interface TransferProps {
  value: number;
  payer_id: string;
  payee_id: string;
  status: "pending" | "completed" | "canceled";

  payer?: Account;
  payee?: Account;
}

class Transfer extends Entity<TransferProps> {
  constructor(props: TransferProps, id?: string) {
    super(props, id);
  }

  static create(props: TransferProps): Transfer {
    const transfer = new Transfer(props);

    return transfer;
  }

  get value() {
    return this.props.value;
  }

  get payee_id() {
    return this.props.payee_id;
  }

  get payer_id() {
    return this.props.payer_id;
  }

  get status() {
    return this.props.status;
  }

  set status(status: "pending" | "completed" | "canceled") {
    this.props.status = status;
  }
}

export { Transfer };
