import { Transfer } from "../entities/transfer";

interface TransferRepository {
  transfer: (
    value: number,
    payer_id: string,
    payee_id: string
  ) => Promise<Transfer>;

  rollback: (transfer_id: string) => Promise<Transfer>;
  findById: (id: string) => Promise<Transfer>;
  findByAccount: (account_id: string) => Promise<Transfer[]>;
  updateStatus: (
    id: string,
    status: "completed" | "canceled" | "pending"
  ) => Promise<Transfer>;
}

export { TransferRepository };
