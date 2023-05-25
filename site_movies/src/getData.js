import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";

const docRef = doc(db, "users", "H7Zfi8dcF2QnbjiVDMs2pnr3ql43");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Nome de usuário:", docSnap.data().nome);
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}