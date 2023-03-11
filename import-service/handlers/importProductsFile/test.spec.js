import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { importProductsFile } from "./index";

jest.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: jest.fn(),
  S3Client: jest.fn(),
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));

describe("Lambda importProductsFile", () => {
  const ENV_VARIABLES = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ENV_VARIABLES,
      BUCKET: "testBucket",
      REGION: "test_eu_region_1",
    };
  });

  afterAll(() => {
    process.env = ENV_VARIABLES;
    jest.resetAllMocks();
  });

  it("should pass a region name from env variables to the S3Client constructor", async () => {
    await importProductsFile({
      queryStringParameters: { name: "test_file_name" },
    });

    expect(S3Client).toHaveBeenCalledWith({ region: "test_eu_region_1" });
  });

  it("should pass a bucket name from env variables and file name from event querystring parameters to the PutObjectCommand constructor", async () => {
    await importProductsFile({
      queryStringParameters: { name: "test_file_name" },
    });

    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: "testBucket",
      Key: "uploaded/test_file_name",
    });
  });

  it("should call getSignedUrl with correct parameters", async () => {
    await importProductsFile({
      queryStringParameters: { name: "test_file_name" },
    });

    const client = {};
    const command = {};

    S3Client.mockReturnValue(client);
    PutObjectCommand.mockReturnValue(command);

    expect(getSignedUrl).toHaveBeenCalledWith(client, command, {
      expiresIn: 3600,
    });
  });

  it("should return correct response in the success scenario", async () => {
    getSignedUrl.mockResolvedValue("http://test_signed_url");

    const result = await importProductsFile({
      queryStringParameters: { name: "test_file_name" },
    });

    expect(result).toEqual({
      statusCode: 202,
      body: "http://test_signed_url",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
  });
});
