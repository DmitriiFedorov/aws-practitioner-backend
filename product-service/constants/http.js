export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const NOT_FOUND_RESPONSE = {
  statusCode: 404,
  headers: {
    ...CORS_HEADERS,
  },
  body: JSON.stringify({ error: "Not found" }),
};

export const SUCCESS_REQUEST = {
  statusCode: 200,
  headers: {
    ...CORS_HEADERS,
  },
};

export const BAD_REQUEST = {
  statusCode: 400,
  headers: {
    ...CORS_HEADERS,
  },
  body: JSON.stringify({ error: "Bad request" }),
};

export const SUCCESS_CREATED = {
  statusCode: 201,
  headers: {
    ...CORS_HEADERS,
  },
  body: JSON.stringify({ status: "Success" }),
};
