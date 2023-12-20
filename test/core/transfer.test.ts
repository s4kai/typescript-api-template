import { Account } from "@/core/entities/account";
import { TransferMoney } from "@/core/usecases/TransferMoney.";
import Queue from "@/infra/lib/Queue";
import { InMemoryAccountRepository } from "@/infra/repositories/InMemoryAccountRepository";
import { InMemoryTransferRepository } from "@/infra/repositories/InMemoryTransferRepository";
import { faker } from "@faker-js/faker";
import { beforeAll, describe, expect, it } from "vitest";

describe("Transfer", () => {
  const transferRepository = new InMemoryTransferRepository();
  const accountRepository = new InMemoryAccountRepository();

  let common: Account;
  let anotherCommon: Account;
  let seller: Account;

  beforeAll(async () => {
    common = Account.create({
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      document: faker.vehicle.vrm(),
      type: "common",
      balance: 1000.0,
    });

    anotherCommon = Account.create({
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      document: faker.vehicle.vrm(),
      type: "common",
      balance: 1000.0,
    });

    const companyName = faker.company.name();

    seller = Account.create({
      fullname: companyName,
      email: faker.internet.email({ firstName: companyName }),
      password: faker.internet.password(),
      document: faker.finance.accountNumber(),
      type: "seller",
      balance: 1000.0,
    });

    await accountRepository.create(common);
    await accountRepository.create(anotherCommon);
    await accountRepository.create(seller);
  });

  it("should be able to transfer money between common and common accounts", async () => {
    const sut = new TransferMoney(accountRepository, transferRepository);

    const transfer = await sut.execute(
      anotherCommon.id,
      common.id,
      (500.0).toString()
    );

    Queue.add("CheckTransaction", {
      data: {
        payee_id: anotherCommon.id,
        payer_id: common.id,
        value: (500.0).toString(),
        id: transfer.id,

        repositories: {
          accountRepository: accountRepository,
          transferRepository: transferRepository,
        },
      },
    });

    expect(transfer).toHaveProperty("id");
  });

  it("should be able to transfer money between common and seller accounts", async () => {
    const sut = new TransferMoney(accountRepository, transferRepository);

    const transfer = await sut.execute(
      seller.id,
      common.id,
      (500.0).toString()
    );

    Queue.add("CheckTransaction", {
      data: {
        payee_id: seller.id,
        payer_id: common.id,
        value: (500.0).toString(),
        id: transfer.id,

        repositories: {
          accountRepository: accountRepository,
          transferRepository: transferRepository,
        },
      },
    });
    expect(transfer).toHaveProperty("id");
  });

  it("should not be able to transfer money between seller and common accounts", async () => {
    const sut = new TransferMoney(accountRepository, transferRepository);

    expect(async () => {
      await sut.execute(common.id, seller.id, (500.0).toString());
    }).rejects.toThrow("Payer can't transfer");
  });

  it("should not be able to transfer money between common and common accounts with insufficient funds", async () => {
    const sut = new TransferMoney(accountRepository, transferRepository);

    expect(async () => {
      await sut.execute(common.id, anotherCommon.id, (5000.0).toString());
    }).rejects.toThrow("Insufficient funds");
  });

  it("should be all transfers completed", async () => {
    const transfers = await transferRepository.findByAccount(common.id);

    transfers.forEach((transfer) => {
      expect(transfer.status).toBe("completed");
    });
  });
});
