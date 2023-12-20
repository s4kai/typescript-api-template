import { CreateAccount } from "@/core/usecases/CreateAccount";
import { InMemoryAccountRepository } from "@/infra/repositories/InMemoryAccountRepository";
import { describe, expect, it } from "vitest";

describe("Account", () => {
  const accountRepository = new InMemoryAccountRepository();

  it("should be able to create a new account", async () => {
    const sut = new CreateAccount(accountRepository);

    const account = await sut.execute(
      "John Doe",
      "johndoe@email.com",
      "123456",
      "000.000.000-00",
      "common"
    );

    expect(account).toHaveProperty("id");
  });

  it("should be able to create a new account with seller type", async () => {
    const sut = new CreateAccount(accountRepository);

    const account = await sut.execute(
      "Market Store",
      "market@email.com",
      "123456",
      "00.000.000/0000-00",
      "seller"
    );

    expect(account.type).toBe("seller");
  });

  it("should not be able to create a new account with invalid type", async () => {
    const sut = new CreateAccount(accountRepository);

    expect(async () => {
      await sut.execute(
        "John Doe",
        "johndoe@email.com",
        "123456",
        "000.000.000-00",
        "invalid type"
      );
    }).rejects.toThrow("Invalid account type");
  });

  it("should not be able to create a new account with an existing email", async () => {
    const sut = new CreateAccount(accountRepository);

    await sut.execute(
      "New Account",
      "already@email.com",
      "123456",
      "123.123.123-63",
      "common"
    );

    expect(async () => {
      await sut.execute(
        "New Account",
        "already@email.com",
        "123456",
        "147.147.159-96",
        "common"
      );
    }).rejects.toThrow("Account already exists");
  });

  it("should not be able to create a new account with an existing document", async () => {
    const sut = new CreateAccount(accountRepository);

    await sut.execute(
      "New Account",
      "email1@email.com",
      "123456",
      "111.111.111-11",
      "common"
    );

    expect(async () => {
      await sut.execute(
        "New Account",
        "email2@email.com",
        "123456",
        "111.111.111-11",
        "common"
      );
    }).rejects.toThrow("Account already exists");
  });
});
