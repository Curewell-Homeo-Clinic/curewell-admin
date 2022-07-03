import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

const region = "ap-south-1";
const productBucketName = process.env.AWS_PRODUCT_S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_PRODUCT_IMAGES_USER_ACCESS_ID;
const secretAccessKey = process.env.AWS_PRODUCT_IMAGES_USER_SECRET_ACCESS_KEY;

const productS3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export async function generateProductImageUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = `product-image_${rawBytes.toString("hex")}`;

  const params = {
    Bucket: productBucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await productS3.getSignedUrlPromise("putObject", params);

  return uploadURL;
}
