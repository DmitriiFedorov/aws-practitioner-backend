const validateCreateProductBody = (requestBody) => {
  const description = requestBody.description;
  const price = requestBody.price;
  const title = requestBody.title;
  const count = requestBody.count;

  let error = undefined;
  let value = undefined;

  if (
    typeof description === "undefined" ||
    typeof price === "undefined" ||
    typeof title === "undefined" ||
    typeof count === "undefined"
  ) {
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
      count,
    };
  }

  return { error, value };
};

export { validateCreateProductBody };
