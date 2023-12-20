import { Account } from "@/core/entities/account";
import { AccountRepository } from "@/core/repositories/account_repository";

class InMemoryAccountRepository implements AccountRepository {
  private items: Account[] = [];

  constructor() {}

  async create(account: Account) {
    this.items.push(account);
    return account;
  }

  async findAll() {
    return this.items;
  }

  async checkIfAccountExists(email: string, document: string) {
    const account = this.items.filter(
      (item) => item.email === email || item.document === document
    );

    if (account.length > 0) {
      throw new Error("Account already exists");
    }
  }

  async findByDocument(document: string) {
    const account = this.items.find((item) => item.document === document);

    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }

  async findByEmail(email: string) {
    const account = this.items.find((item) => item.email === email);

    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }

  async findById(id: string) {
    const account = this.items.find((item) => item.id === id);

    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }

  async updateBalance(id: string, value: number) {
    const account = await this.findById(id);
    account.balance += value;

    this.update(account);

    return account;
  }

  async update(account: Account) {
    const index = this.items.findIndex((item) => item.id === account.id);
    this.items[index] = account;
    return account;
  }
}

export { InMemoryAccountRepository };
