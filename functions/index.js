// // // Create and deploy your first functions
// // // https://firebase.google.com/docs/functions/get-started
// //
// // exports.helloWorld = functions.https.onRequest((request, response) => {
// //   functions.logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

// import * as functions from "firebase-functions"
// // import { db } from "../utils/firebase"
// import { collection, doc, setDoc, updateDoc } from "firebase/firestore"
// const admin = require("firebase-admin")
// admin.initializeApp()
// const db = admin.firestore()

// export const createUserDetails = functions.auth.user().onCreate((user) => {
//   // const userRef = doc(db, 'users', user.uid)
//   // setDoc(userRef, JSON.parse(JSON.stringify(user)))
//   // updateDoc(userRef, {
//   //   friendsOf: [],
//   //   bio: ""
//   // })
//   // const userData = {
//   //   ...JSON.parse(JSON.stringify(user)),
//   //   friendsOf: [],
//   //   bio: "",
//   // }
//   // const db = 
//   db.collection('userDetails')
//   .doc(user.uid)
//   .set({
//     uid: user.uid,
//     displayName: user.displayName,
//     photoURL: user.photoURL,
//     friendsOf: [],
//     bio: "",
//   })
//   // const userRef = doc(db, 'users', user.uid)
//   // setDoc(userRef, {
//   //   ...user,
//   //   friendsOf: [],
//   //   bio: "",
//   // })
// })
