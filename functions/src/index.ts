import * as functions from "firebase-functions";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()

export const createUserDocument = functions.auth.user().onCreate((user) => {
  const userData = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    friendsOf: [],
    bio: "",
  }
  db.collection("users")
  .doc(user.uid)
  .set(userData)
})