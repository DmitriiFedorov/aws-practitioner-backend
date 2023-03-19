import { randomUUID } from "crypto";
import AWS from "aws-sdk";
import { createProductTransaction } from "../../services/dynamoDB";

const catalogBatchProcess = async (event) => {
  try {
    const region = process.env.REGION;

    const products = event.Records.map(({ body }) => JSON.parse(body));
    const sns = new AWS.SNS({ region });

    const productsWithID = products.map((product) => ({
      ...product,
      id: randomUUID(),
    }));

    for (const product of productsWithID) {
      await createProductTransaction(product);
    }

    const productsAddedValue =
      products.length > 1 ? "moreThanOne" : "lessThanOne";

    await sns
      .publish({
        Subject: "Products are added to the DB",
        Message: JSON.stringify(products),
        TopicArn: process.env.SNS_ARN,
        MessageAttributes: {
          productsAdded: {
            DataType: "String",
            StringValue: productsAddedValue,
          },
        },
      })
      .promise();

    return {
      statusCode: 202,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export { catalogBatchProcess };
