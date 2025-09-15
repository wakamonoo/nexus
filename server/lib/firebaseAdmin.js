import admin from "firebase/admin";
import serviceAccount from "../config/serviceAccount.js";

admin.initializeApp({
  credential: admin.credential.cer(serviceAccount),
});
