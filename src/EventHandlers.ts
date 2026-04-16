/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Factory,
  Factory_TokenCreated,
  Factory_Trade,
} from "generated";

Factory.TokenCreated.handler(async ({ event, context }) => {
  const entity: Factory_TokenCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenAddress: event.params.tokenAddress,
    name: event.params.name,
    symbol: event.params.symbol,
    ipfsCID: event.params.ipfsCID,
  };

  context.Factory_TokenCreated.set(entity);
});

Factory.Trade.handler(async ({ event, context }) => {
  const entity: Factory_Trade = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenAddress: event.params.tokenAddress,
    user: event.params.user,
    tokenAmount: event.params.tokenAmount,
    usdcAmount: event.params.usdcAmount,
    isBuy: event.params.isBuy,
    timestamp: event.params.timestamp,
  };

  context.Factory_Trade.set(entity);
});
