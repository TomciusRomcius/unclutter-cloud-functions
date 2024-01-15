/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const AWS = require("aws-sdk");
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_KMS_KEY_ID = process.env.AWS_KMS_KEY_ID;

AWS.config.update({
  region: "eu-north-1",
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const kms = new AWS.KMS();

exports.AWSencrypt = functions
  .region("europe-west1")
  .https.onCall(async (data: any, context: any) => {    
    const params = {
      KeyId: AWS_KMS_KEY_ID,
      Plaintext: Buffer.from(data.data),
    };
    try {
      const result = await new Promise((resolve, reject) => {
        kms.encrypt(params, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.CiphertextBlob.toString("base64"));
          }
        });
      });

      return { result: result, error: false };
    } catch (error) {
      return { result: "", error: true };
    }
    
  });

exports.AWSdecrypt = functions
  .region("europe-west1")
  .https.onCall(async (data: any, context: any) => {
    const params = {
      CiphertextBlob: Buffer.from(data.data, "base64"),
    };
    try {
      const result = await new Promise((resolve, reject) => {
        kms.decrypt(params, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.Plaintext.toString("ascii"));
          }
        });
      });

      return { result: result, error: false };
    } catch (error) {
      return { result: "", error: true };
    }
  });

      /*
    const params = {
      CiphertextBlob: Buffer.from(data.data, "base64"),
    };
    try {
      const result = await new Promise((resolve, reject) => {
        kms.decrypt(params, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.Plaintext.toString("ascii"));
          }
        });
      });

      return { result: result, error: false };
    } catch (error) {
      return { result: "", error: true };
    }
    */
