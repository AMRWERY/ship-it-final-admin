import { auth, db } from "~/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  updatePassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

    async registerUser(email, password, firstName, lastName, role = "user") {
      this.isOverlayVisible = true;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const userData = {
          uid: user.uid,
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          role: role,
          loginType: "email",
          createdAt: new Date(),
        };
        await setDoc(doc(db, "users", user.uid), userData);
        localStorage.setItem("user", JSON.stringify(userData));
        this.role = role;
        await this.fetchUserData(user.uid);
        this.error = null;
        return user;
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async loginUser(email, password) {
      this.isOverlayVisible = true;
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
        setTimeout(() => {
          this.isOverlayVisible = false;
        }, 3000);
        this.error = null;
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async loginWithGoogle() {
      this.isOverlayVisible = true;
      try {
        await setPersistence(auth, browserLocalPersistence);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        this.user = user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        let userData;
        if (!userDoc.exists()) {
          userData = {
            uid: user.uid,
            email: user.email,
            firstName: user.displayName?.split(" ")[0] || "FirstName",
            lastName: user.displayName?.split(" ")[1] || "LastName",
            role: "user",
            loginType: "google",
            createdAt: new Date(),
          };
          await setDoc(userDocRef, userData);
        } else {
          userData = userDoc.data();
        }
        const sessionUserData = {
          uid: userData.uid,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          loginType: userData.loginType,
        };
        localStorage.setItem("user", JSON.stringify(sessionUserData));
        this.role = userData.role || "user";
        await this.fetchUserData(user.uid);
        setTimeout(() => {
          this.isOverlayVisible = false;
        }, 3000);
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

    saveProfile(file) {
      return new Promise((resolve, reject) => {
        if (!this.user) {
          reject(new Error("User not authenticated"));
          return;
        }
        const storage = getStorage();
        const userDocRef = doc(db, "users", this.user.uid);
        let profileImgUrl = this.user.profileImg || null;
        const updateProfile = () => {
          const updatedProfile = {
            firstName: this.user.firstName || "",
            lastName: this.user.lastName || "",
            email: this.user.email || "",
            phone: this.user.phone || null,
            birthDate: this.user.birthDate || null,
            profileImg: profileImgUrl,
            address: this.user.address || "",
            apartment: this.user.apartment || "",
            selectedCity: this.user.selectedCity || "",
          };
          updateDoc(userDocRef, updatedProfile)
            .then(() => {
              this.user = { ...this.user, ...updatedProfile };
              const sessionUserData =
                JSON.parse(localStorage.getItem("user")) || {};
              localStorage.setItem(
                "user",
                JSON.stringify({ ...sessionUserData, ...updatedProfile })
              );
              resolve("Profile updated successfully");
            })
            .catch((error) => {
              // console.error("Failed to update Firestore document:", error);
              reject(error);
            });
        };
        if (file) {
          const storageRef = ref(
            storage,
            `users/${this.user.uid}/${file.name}`
          );
          uploadBytes(storageRef, file)
            .then(() => getDownloadURL(storageRef))
            .then((url) => {
              profileImgUrl = url;
              updateProfile();
            })
            .catch((error) => {
              console.error(
                "Failed to upload file or get download URL:",
                error
              );
              reject(error);
            });
        } else {
          updateProfile();
        }
      });
    },

    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email);
        return "Password reset email sent successfully!";
      } catch (error) {
        this.error = error.message;
        throw new Error(
          "Failed to send password reset email: " + error.message
        );
      }
    },

    changePassword(currentPassword, newPassword) {
      const user = auth.currentUser;
      if (!user) {
        return Promise.reject(new Error("User is not authenticated"));
      }
      // You might want to reauthenticate the user first (for added security)
      // Here you would ask the user for their current password and reauthenticate them
      return updatePassword(user, newPassword)
        .then(() => {
          return "Password updated successfully!";
        })
        .catch((error) => {
          this.error = error.message;
          return Promise.reject(
            new Error("Failed to change password: " + error.message)
          );
        });
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.role === "admin",
  },
});
