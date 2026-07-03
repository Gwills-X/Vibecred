import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadMedia(file, folderName, fileName) {
  // Path: posts/{postId}/image.jpg OR users/{userId}/profile.jpg
  const storageRef = ref(storage, `${folderName}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}
