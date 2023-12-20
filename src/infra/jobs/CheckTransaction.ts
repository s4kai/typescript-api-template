import axios from "axios";
import { Transfer } from "../../core/entities/transfer";
import { InMemoryAccountRepository } from "../repositories/InMemoryAccountRepository";
import { InMemoryTransferRepository } from "../repositories/InMemoryTransferRepository";

type CheckTransferDTO = {
  data: {
    id: string;
    payer_id: string;
    payee_id: string;
    value: number;
  };
};

export default {
  key: "CheckTransaction",
  async handle({ data }: CheckTransferDTO): Promise<Transfer> {
    const accountRepository = new InMemoryAccountRepository();
    const transferRepository = new InMemoryTransferRepository();

    const checkTransfer = await axios.get(
      "https://run.mocky.io/v3/5794d450-d2e2-4412-8131-73d0293ac1cc"
    );

    if (checkTransfer.data.message !== "Autorizado") {
      const failedTransfer = await transferRepository.rollback(data.id);
      return failedTransfer;
    }

    const transfer = await transferRepository.updateStatus(
      data.id,
      "completed"
    );

    await accountRepository.updateBalance(data.payer_id, -Number(data.value));
    await accountRepository.updateBalance(data.payee_id, Number(data.value));

    return transfer;
  },
};
