import { Entity } from "./base_entity";

interface AccountProps {
  type: "common" | "seller";
  document: string;
  fullname: string;
  email: string;
  password: string;
  balance: number;
}

class Account extends Entity<AccountProps> {
  constructor(props: AccountProps, id?: string) {
    super(props, id);
  }

  static create(props: AccountProps) {
    const account = new Account(props);

    return account;
  }

  get balance() {
    return this.props.balance;
  }

  set balance(value: number) {
    this.props.balance = value;
  }

  get document() {
    return this.props.document;
  }

  get email() {
    return this.props.email;
  }

  get canTransfer() {
    return this.props.type == "common";
  }

  get type() {
    return this.props.type;
  }
}

export { Account };
