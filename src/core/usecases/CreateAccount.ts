import { Account } from "../entities/account";
import { AccountRepository } from "../repositories/account_repository";

class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(
    fullname: string,
    email: string,
    password: string,
    document: string,
    type: string
  ) {
    if (type !== "common" && type !== "seller") {
      throw new Error("Invalid account type");
    }

    if (await this.accountExists(email, document)) {
      throw new Error("Account already exists");
    }

    const account = Account.create({
      fullname,
      email,
      password,
      document,
      type,
      balance: 0.0,
    });

    return this.accountRepository.create(account);
  }

  private async accountExists(email: string, document: string) {
    try {
      await this.accountRepository.checkIfAccountExists(email, document);
      return false;
    } catch {
      return true;
    }
  }
}

export { CreateAccount };
