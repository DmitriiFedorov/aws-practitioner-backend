const express = require("express");
require("dotenv").config();
const axios = require("axios").default;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all("/*", async (req, res) => {
  const recipient = req.originalUrl.split("/")[1];

  const recipientUrl = process.env[recipient];

  if (recipientUrl) {
    const data =
      Object.keys(req.body).length > 0 ? { data: req.body } : undefined;

    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      ...data,
    };

    try {
      const response = await axios(axiosConfig);

      res.json(response.data);
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;

        res.status(status).json(data);
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(502).json({ error: "Cannot process request" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on PORT=${PORT}`);
});
