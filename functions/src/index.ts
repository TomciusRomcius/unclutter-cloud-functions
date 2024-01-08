/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const functions = require('firebase-functions');
const AWS = require("aws-sdk");
const dotenv = require('dotenv');
dotenv.config({path: ".env"});

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_KMS_KEY_ID = process.env.AWS_KMS_KEY_ID;

AWS.config.update({
  region: "eu-west-1",
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const kms = new AWS.KMS();

exports.AWSencrypt =
functions.region("europe-west1")
.https.onCall(
  (data: any, context: any) => 
{
  return kms.encrypt({
    KeyId: AWS_KMS_KEY_ID,
    Plaintext: data.plaintext
  }).then((data: any) => {
    return data.CiphertextBlob.toString('base64');
  })
  .catch((err: any) => {
    console.log(err);
    return "err";
  });
});