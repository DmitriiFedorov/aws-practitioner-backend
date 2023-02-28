import { exec } from "child_process";

import books from "./dynamoDbProducts.json" assert { type: "json" };

const PRODUCTS_TABLE_NAME = "AWS_Practitioner_Products";
const STOCKS_TABLE_NAME = "AWS_Practitioner_Stocks";
const MAX_STOCK_AMOUNT = 12;

const createStockTableItem = (product_id) => {
  const stockItem = {
    product_id: {
      S: product_id,
    },
    count: {
      N: String(Math.floor(Math.random() * MAX_STOCK_AMOUNT) || 1),
    },
  };

  return JSON.stringify(stockItem);
};

const createCommand = (tableName, item) => {
  return `aws dynamodb put-item --table-name ${tableName} --item "${item.replaceAll(
    '"',
    '\\"'
  )}"`;
};

const addItemsToTable = () => {
  books.forEach((book) => {
    const bookItem = JSON.stringify(book);
    const bookCommand = createCommand(PRODUCTS_TABLE_NAME, bookItem);

    const stockItem = createStockTableItem(book.id.S);
    const stockCommand = createCommand(STOCKS_TABLE_NAME, stockItem);

    exec(bookCommand, (err, stdout, stderr) => {
      console.log({ err, stdout, stderr });
    });

    exec(stockCommand, (err, stdout, stderr) => {
      console.log({ err, stdout, stderr });
    });
  });
};

addItemsToTable();
