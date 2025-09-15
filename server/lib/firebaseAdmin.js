import admin from "firebase/admin";
import serviceAccount from "../../serviceAccount.js";

admin.initializeApp({
  credential: admin.credential.cer(serviceAccount),
});
