import { getProductsById } from "./index";

jest.mock("../../mocks", () => ({
  products: [
    {
      description: "Test Product Description",
      id: "testId",
      price: 24,
      title: "Test Product",
    },
  ],
}));

describe("handler getProductsById", () => {
  it("should return correct result if correct id provided", async () => {
    const event = {
      pathParameters: {
        productId: "testId",
      },
    };

    const { statusCode, body } = await getProductsById(event);

    expect(statusCode).toBe(200);
    expect(JSON.parse(body)).toEqual({
      description: "Test Product Description",
      id: "testId",
      price: 24,
      title: "Test Product",
    });
  });

  it("should return not found result if id is wrong", async () => {
    const event = {
      pathParameters: {
        productId: "wrong id",
      },
    };

    const { statusCode, body } = await getProductsById(event);

    expect(statusCode).toBe(404);
    expect(JSON.parse(body)).toEqual({ error: "Not found" });
  });
});
