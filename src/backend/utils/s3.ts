import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

const region = "ap-south-1";
const accessKeyId = process.env.AWS_IMAGES_USER_ACCESS_ID;
const secretAccessKey = process.env.AWS_IMAGES_USER_SECRET_ACCESS_KEY;

const BUCKETS = {
  patients: process.env.AWS_PATIENT_S3_BUCKET_NAME!,
  products: process.env.AWS_PRODUCT_S3_BUCKET_NAME!,
};

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export async function generateImageUploadURL(entity: keyof typeof BUCKETS) {
  const rawBytes = await randomBytes(16);
  const imageName = `${entity}-image_${rawBytes.toString("hex")}`;

  const params = {
    Bucket: BUCKETS[entity],
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);

  return { imageName, uploadURL };
}

export async function deleteImages(
  entity: keyof typeof BUCKETS,
  objectKeys: string[]
) {
  return await s3
    .deleteObjects({
      Bucket: BUCKETS[entity],
      Delete: { Objects: [...objectKeys.map((key) => ({ Key: key }))] },
    })
    .promise();
}
