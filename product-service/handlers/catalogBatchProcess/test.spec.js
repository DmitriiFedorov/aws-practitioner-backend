import { catalogBatchProcess } from "./index";
import { createProductTransaction } from "../../services/dynamoDB";

jest.mock("../../services/dynamoDB", () => ({
  createProductTransaction: jest.fn(),
}));

let mockSNSPromise = jest.fn();

jest.mock("aws-sdk", () => ({
  __esModule: true,
  default: {
    SNS: jest.fn().mockReturnValue({
      publish: jest.fn().mockReturnValue({
        promise: () => {
          mockSNSPromise();
        },
      }),
    }),
  },
}));

const event = {
  Records: [
    {
      body: JSON.stringify({
        title: "test title 1",
        description: "test description 1",
        price: 10,
        count: 5,
      }),
    },
    {
      body: JSON.stringify({
        title: "test title 2",
        description: "test description 2",
        price: 10,
        count: 5,
      }),
    },
  ],
};

process.env.REGION = "test-region";

describe("function catalogBatchProcess", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should extract products from event and invoke the createProductTransaction for each of the product", async () => {
    await catalogBatchProcess(event);

    expect(createProductTransaction).toHaveBeenCalledTimes(2);
  });

  it("should publish to an sns topic after products are created", async () => {
    await catalogBatchProcess(event);

    expect(mockSNSPromise).toHaveBeenCalledTimes(1);
  });

  it("should return correct response", async () => {
    const res = await catalogBatchProcess(event);

    expect(res).toEqual({
      statusCode: 202,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
  });
});
