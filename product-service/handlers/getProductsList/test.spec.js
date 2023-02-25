import { getProductsList } from "./index";

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

describe("handler getProductsList", () => {
  it("should return correct result", async () => {
    const { statusCode, body } = await getProductsList();

    expect(statusCode).toBe(200);
    expect(JSON.parse(body)).toEqual([
      {
        description: "Test Product Description",
        id: "testId",
        price: 24,
        title: "Test Product",
      },
    ]);
  });
});
