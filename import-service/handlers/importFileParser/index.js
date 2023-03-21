import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import cvs from "csv-parser";

export const importFileParser = async (event) => {
  try {
    const region = process.env.REGION;
    const bucket = process.env.BUCKET;
    const client = new S3Client({ region });

    for await (const record of event.Records) {
      const key = record.s3.object.key;
      const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
      const response = await client.send(getCommand);

      console.log("A CVS file parse start");
      await new Promise((resolve, reject) => {
        response.Body.pipe(cvs())
          .on("data", (data) => console.log(data))
          .on("end", async () => {
            console.log("The file stream has ended");

            const fileName = key.split("/")[1];

            const copyCommand = new CopyObjectCommand({
              Bucket: bucket,
              Key: `parsed/${fileName}`,
              CopySource: `${bucket}/${key}`,
            });

            try {
              console.log("The file started moving to the 'parsed/' folder");
              await client.send(copyCommand);
              console.log("File moved to the 'parsed/' folder");

              const deleteCommand = new DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
              });

              console.log(
                "A copy of the file has begun to be removed from the 'uploaded/' folder"
              );
              await client.send(deleteCommand);
              console.log(
                "The copy of the file has been removed from the 'uploaded/' folder"
              );
            } catch (error) {
              reject(error);
            }

            resolve();
          });
      });

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
};
