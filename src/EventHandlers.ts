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
    // CHANGE THIS LINE: 
    // If 'event.transaction.from' failed, use 'event.srcAddress' 
    // or 'event.params.user' (if your event has it)
    creator: event.srcAddress, 
    currentSupply: 0n,
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