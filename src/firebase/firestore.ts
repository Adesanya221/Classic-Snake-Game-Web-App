import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  Timestamp,
  where,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./config";
import { ScoreEntry } from "@/components/Scoreboard";

// Collection references
const scoresCollection = collection(db, "scores");

// Add a new score to Firestore
export const addScore = async (scoreData: Omit<ScoreEntry, "id">) => {
  try {
    const docRef = await addDoc(scoresCollection, {
      ...scoreData,
      date: Timestamp.fromDate(new Date(scoreData.date)),
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...scoreData };
  } catch (error) {
    console.error("Error adding score:", error);
    throw error;
  }
};

// Get top scores from Firestore
export const getTopScores = async (limit_count = 10) => {
  try {
    const q = query(
      scoresCollection,
      orderBy("score", "desc"),
      limit(limit_count)
    );
    
    const querySnapshot = await getDocs(q);
    const scores: ScoreEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        playerName: data.playerName,
        playerAge: data.playerAge,
        playerImage: data.playerImage,
        score: data.score,
        date: data.date.toDate().toISOString()
      });
    });
    
    return scores;
  } catch (error) {
    console.error("Error getting top scores:", error);
    return [];
  }
};

// Get scores for a specific player
export const getPlayerScores = async (playerName: string) => {
  try {
    const q = query(
      scoresCollection,
      where("playerName", "==", playerName),
      orderBy("score", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const scores: ScoreEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        playerName: data.playerName,
        playerAge: data.playerAge,
        playerImage: data.playerImage,
        score: data.score,
        date: data.date.toDate().toISOString()
      });
    });
    
    return scores;
  } catch (error) {
    console.error("Error getting player scores:", error);
    return [];
  }
};

// Update a score
export const updateScore = async (id: string, scoreData: Partial<ScoreEntry>) => {
  try {
    const scoreRef = doc(db, "scores", id);
    const updateData: any = { ...scoreData };
    
    // Convert date string to Timestamp if it exists
    if (scoreData.date) {
      updateData.date = Timestamp.fromDate(new Date(scoreData.date));
    }
    
    await updateDoc(scoreRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating score:", error);
    return false;
  }
};

// Delete a score
export const deleteScore = async (id: string) => {
  try {
    const scoreRef = doc(db, "scores", id);
    await deleteDoc(scoreRef);
    return true;
  } catch (error) {
    console.error("Error deleting score:", error);
    return false;
  }
};
