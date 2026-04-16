import { Factory, Token, Factory_TokenCreated, Factory_Trade } from "generated";

Factory.TokenCreated.handler(async ({ event, context }) => {
  const eventEntity: Factory_TokenCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenAddress: event.params.tokenAddress,
    name: event.params.name,
    symbol: event.params.symbol,
    ipfsCID: event.params.ipfsCID,
  };
  context.Factory_TokenCreated.set(eventEntity);

  const tokenEntity: Token = {
    id: event.params.tokenAddress,
    name: event.params.name,
    symbol: event.params.symbol,
    ipfsCID: event.params.ipfsCID,
    creator: event.transaction.from,
    currentSupply: 0n, // Starts at 0, updated by the first Trade event
    reserveUSDC: 0n,
    tradeCount: 0,
  };
  context.Token.set(tokenEntity);
});

Factory.Trade.handler(async ({ event, context }) => {
  const tradeEntity: Factory_Trade = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenAddress: event.params.tokenAddress,
    user: event.params.user,
    tokenAmount: event.params.tokenAmount,
    usdcAmount: event.params.usdcAmount,
    isBuy: event.params.isBuy,
    timestamp: event.params.timestamp,
  };
  context.Factory_Trade.set(tradeEntity);

  // CRITICAL: This is the logic that moves the progress bar on your dashboard
  const token = await context.Token.get(event.params.tokenAddress);
  if (token) {
    let newSupply = token.currentSupply;
    let newReserve = token.reserveUSDC;

    if (event.params.isBuy) {
      newSupply += event.params.tokenAmount;
      newReserve += event.params.usdcAmount;
    } else {
      newSupply -= event.params.tokenAmount;
      newReserve -= event.params.usdcAmount;
    }

    context.Token.set({
      ...token,
      currentSupply: newSupply,
      reserveUSDC: newReserve,
      tradeCount: token.tradeCount + 1,
    });
  }
});