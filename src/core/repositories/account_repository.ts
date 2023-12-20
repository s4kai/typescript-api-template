import { Account } from "../entities/account";

interface AccountRepository {
  create: (account: Account) => Promise<Account>;
  findById: (id: string) => Promise<Account>;
  checkIfAccountExists: (email: string, document: string) => Promise<void>;
  updateBalance: (id: string, value: number) => Promise<Account>;
  findByDocument: (document: string) => Promise<Account>;
  findByEmail: (email: string) => Promise<Account>;
  findAll: () => Promise<Account[]>;
}

export { AccountRepository };
