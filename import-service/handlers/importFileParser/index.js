import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import cvs from "csv-parser";

export const importFileParser = async (event) => {
  try {
    const region = process.env.REGION;
    const bucket = process.env.BUCKET;

    for (const record of event.Records) {
      const key = record.s3.object.key;

      console.log({ key });
      console.log({ bucket: record.s3.bucket });

      const client = new S3Client({ region });
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const response = await client.send(command);

      console.log("CVS parse start");
      response.Body.pipe(cvs())
        .on("data", (data) => console.log(data))
        .on("end", () => {
          console.log("File stream has ended");
        });
    }
  } catch (error) {
    console.log(error);
  }
};
