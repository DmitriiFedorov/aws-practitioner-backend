const validateCreateProductBody = (requestBody) => {
  const description = requestBody.description;
  const price = requestBody.price;
  const title = requestBody.title;

  let error = undefined;
  let value = undefined;

  if (description === undefined || price === undefined || title === undefined) {
    error = true;
  }

  if (typeof description !== "string") {
    error = true;
  }

  if (typeof price !== "number") {
    error = true;
  }

  if (typeof title !== "string") {
    error = true;
  }

  if (!error) {
    value = {
      description,
      title,
      price,
    };
  }

  return { error, value };
};

export { validateCreateProductBody };
