import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from './../config/FirebaseConfig';

export const GetFavList = async (user) => {
    if (!user) return null;

    const userEmail = user.email;
    const docRef = doc(db, 'UserFavPet', userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // Create a new document with the user's email and an empty favorites array
        await setDoc(docRef, {
            email: userEmail,
            favorites: []
        });
        return { email: userEmail, favorites: [] }; // Return the newly created document data
    }
};

export const UpdateFav = async (user, favorites) => {
    if (!user) return;

    const userEmail = user.email;
    const docRef = doc(db, 'UserFavPet', userEmail);

    try {
        await updateDoc(docRef, { favorites });
    } catch (error) {
        console.error("Error updating favorites: ", error);
    }
};

export default {
    GetFavList,
    UpdateFav
};
