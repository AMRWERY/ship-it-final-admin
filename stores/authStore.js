import { auth, db } from "~/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    user: null,
    error: null,
    role: null,
    isOverlayVisible: false,
  }),

  actions: {
    async init() {
      await setPersistence(auth, browserLocalPersistence);
      const user = auth.currentUser;
      if (user) {
        await this.fetchUserData(user.uid);
        // this.user = user;
      }
    },

    async fetchUserData(uid) {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.user = { ...userData };
          this.role = userData.role || "user";
          // console.log('user data:', userData)
        } else {
          throw new Error("User data not found");
        }
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async loginUser(email, password) {
      try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        this.user = user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.role = userData?.role || "user";
          const saveUserData = {
            uid: userData.uid,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            loginType: userData.loginType,
          };
          localStorage.setItem("user", JSON.stringify(saveUserData));
        } else {
          this.role = "user";
        }
        await this.fetchUserData(user.uid);
        this.error = null;
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async logoutUser() {
      this.isOverlayVisible = true;
      try {
        await signOut(auth);
        this.user = null;
        this.role = null;
        this.error = null;
        localStorage.clear();
        setTimeout(() => {
          this.isOverlayVisible = false;
        }, 3000);
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
