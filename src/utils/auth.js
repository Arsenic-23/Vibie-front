import { getAuth } from "firebase/auth";

export async function getFirebaseToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  return await user.getIdToken(true);
}
