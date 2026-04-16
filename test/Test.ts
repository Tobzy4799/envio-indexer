import assert from "assert";
import { 
  TestHelpers,
  Factory_TokenCreated
} from "generated";
const { MockDb, Factory } = TestHelpers;

describe("Factory contract TokenCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Factory contract TokenCreated event
  const event = Factory.TokenCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Factory_TokenCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Factory.TokenCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualFactoryTokenCreated = mockDbUpdated.entities.Factory_TokenCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedFactoryTokenCreated: Factory_TokenCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      tokenAddress: event.params.tokenAddress,
      name: event.params.name,
      symbol: event.params.symbol,
      ipfsCID: event.params.ipfsCID,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualFactoryTokenCreated, expectedFactoryTokenCreated, "Actual FactoryTokenCreated should be the same as the expectedFactoryTokenCreated");
  });
});
