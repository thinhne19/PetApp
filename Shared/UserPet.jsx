import { db } from "./../config/firebaseConfig";
import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const GetPetList = async (user) => {
  const docSnap = await getDoc(
    doc(db, "UserPets", user?.primaryEmailAddress?.emailAddress)
  );

  if (docSnap?.exists()) {
    return docSnap.data();
  } else {
    await setDoc(doc(db, "UserPets", user?.primaryEmailAddress?.emailAddress), {
      email: user?.primaryEmailAddress?.emailAddress,
      petId: [],
    });
    return { petId: [] }; // Trả về object trống nếu chưa có pet
  }
};

const UpdatePet = async (user, petId) => {
  const docRef = doc(db, "UserPets", user?.primaryEmailAddress?.emailAddress);
  try {
    await updateDoc(docRef, {
      petId: arrayUnion(petId), // Sử dụng arrayUnion để không bị trùng lặp
    });
  } catch (e) {
    console.error("Error updating pet list:", e);
  }
};

export default {
  GetPetList,
  UpdatePet,
};
