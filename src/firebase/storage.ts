import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

// Upload a profile image
export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `profile_images/${userId}/${file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Upload a game screenshot
export const uploadGameScreenshot = async (file: File, userId: string, score: number): Promise<string> => {
  try {
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `game_screenshots/${userId}/${timestamp}_score_${score}.png`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    throw error;
  }
};

// Delete a file from storage
export const deleteFile = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const fileRef = ref(storage, fileUrl);
    
    // Delete the file
    await deleteObject(fileRef);
    
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};
