import { TransferEvent, Message, Block } from "../types";
import {
  CosmosEvent,
  CosmosBlock,
  CosmosMessage,
  CosmosTransaction,
} from "@subql/types-cosmos";
import { MsgSend } from "../types/proto-interfaces/cosmos/bank/v1beta1/tx";


export async function handleBlock(block: CosmosBlock): Promise<void> {
  // If you want to index each block in Cosmos (DYDX), you could do that here
  logger.info(`Block found at ${block.block.header.height}`);
  const blockRecord = Block.create({
    id: block.block.id,
    height: BigInt(block.block.header.height),
  })
  await blockRecord.save();
}


/*
export async function handleTransaction(tx: CosmosTransaction): Promise<void> {
  // If you want to index each transaction in Cosmos (DYDX), you could do that here
  const transactionRecord = Transaction.create({
    id: tx.hash,
    blockHeight: BigInt(tx.block.block.header.height),
    timestamp: tx.block.block.header.time,
  });
  await transactionRecord.save();
}
*/

export async function handleMessage(
  msg: CosmosMessage<MsgSend>
): Promise<void> {
  logger.info(`Messsage found at ${msg.block.blockId}`);
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    blockHeight: BigInt(msg.block.block.header.height),
    txHash: msg.tx.hash,
    from: msg.msg.decodedMsg.fromAddress,
    to: msg.msg.decodedMsg.toAddress,
    amount: JSON.stringify(msg.msg.decodedMsg.amount),
  });

  await messageRecord.save();
}

export async function handleUpdateSubaccount(event: CosmosEvent): Promise<void> {
  logger.info(`Event found at ${event.block.header.height.toString()}`);
  logger.info(
    `SubAccount update event: ${JSON.stringify(event.event.attributes, null, 2)}`
  );
}
