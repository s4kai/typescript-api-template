import { AccountRepository } from "../repositories/account_repository";
import { TransferRepository } from "../repositories/transfer_repository";

class TransferMoney {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transferRepository: TransferRepository
  ) {}

  async execute(payee_id: string, payer_id: string, value: string) {
    const payer = await this.accountRepository.findById(payer_id);
    const payee = await this.accountRepository.findById(payee_id);

    if (!payer.canTransfer) {
      throw new Error("Payer can't transfer");
    }

    if (payer.balance < Number(value)) {
      throw new Error("Insufficient funds");
    }

    if (payer_id === payee_id) {
      throw new Error("Payer and payee must be different");
    }

    const transfer = await this.transferRepository.transfer(
      Number(value),
      payer_id,
      payee_id
    );

    return transfer;
  }
}

export { TransferMoney };
