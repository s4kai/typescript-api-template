import { Transfer } from "@/core/entities/transfer";
import { TransferRepository } from "@/core/repositories/transfer_repository";

class InMemoryTransferRepository implements TransferRepository {
  private transfers: Transfer[] = [];

  async transfer(value: number, payer_id: string, payee_id: string) {
    const transfer = Transfer.create({
      value,
      payer_id,
      payee_id,
      status: "pending",
    });

    this.transfers.push(transfer);

    return transfer;
  }

  async findById(id: string) {
    const transfer = await this.transfers.find(
      (transfer) => transfer.id === id
    );

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    return transfer;
  }

  async updateStatus(id: string, status: "completed" | "canceled" | "pending") {
    const transfer = await this.findById(id);
    transfer.status = status;

    this.transfers = this.transfers.map((item) =>
      item.id === id ? transfer : item
    );

    return transfer;
  }

  async rollback(transfer_id: string) {
    const transfer = await this.findById(transfer_id);
    transfer.status = "canceled";

    this.transfers = this.transfers.map((item) =>
      item.id === transfer_id ? transfer : item
    );

    return transfer;
  }

  async findByAccount(account_id: string) {
    const transfers = await this.transfers.filter(
      (transfer) =>
        transfer.payer_id === account_id || transfer.payee_id === account_id
    );

    return transfers;
  }
}

export { InMemoryTransferRepository };
