import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp();

export const initializeShopInDB = functions.auth
  .user()
  .onCreate(async (user) => {
    functions.logger.log(
      `Welcome ${user.displayName}, Hope you have a good day`
    );
    await admin.firestore().collection("Users").add({
      displayName: user.displayName,
      email: user.email,
      favourites: [],
    });
  });