import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
    paginatedUsers: [],
    currentPage: 1,
    usersPerPage: 8,
  }),

  actions: {
    fetchUsers() {
      return getDocs(collection(db, "users"))
        .then((querySnapshot) => {
          this.users = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          this.users = this.users.filter(
            (user) => user.email !== "admin@cospora.com"
          );
          this.updatePagination();
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },

    updatePagination() {
      this.paginatedUsers = this.users.slice(
        (this.currentPage - 1) * this.usersPerPage,
        this.currentPage * this.usersPerPage
      );
    },

    deleteUser(userId) {
      const docRef = doc(db, "users", userId);
      return deleteDoc(docRef)
        .then(() => {
          this.users = this.users.filter((user) => user.id !== userId);
          this.updatePagination();
          // console.log(`User with ID ${userId} deleted successfully.`);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    },

    blockUser(userId) {
      const userRef = doc(db, "users", userId);
      return updateDoc(userRef, { isBlocked: true })
        .then(() => {
          const userIndex = this.users.findIndex((user) => user.id === userId);
          if (userIndex > -1) {
            this.users[userIndex].isBlocked = true;
            // console.log(`User with ID ${userId} blocked successfully.`);
          } else {
            console.warn(
              "User not found in local store while blocking:",
              userId
            );
          }
        })
        .catch((error) => {
          console.error("Failed to block user:", error);
        });
    },

    toggleBlockUser(userId) {
      const userIndex = this.users.findIndex((user) => user.id === userId);
      if (userIndex > -1) {
        const user = this.users[userIndex];
        const newStatus = !user.isBlocked;
        const userRef = doc(db, "users", userId);
        return updateDoc(userRef, { isBlocked: newStatus })
          .then(() => {
            this.users[userIndex].isBlocked = newStatus;
            // console.log(
            //   `User with ID ${userId} ${
            //     newStatus ? "blocked" : "unblocked"
            //   } successfully.`
            // );
          })
          .catch((error) => {
            console.error("Failed to toggle block status for user:", error);
          });
      } else {
        console.warn("User not found in local store:", userId);
        return Promise.resolve();
      }
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },
  },

  getters: {
    totalPages() {
      return Math.ceil(this.users.length / this.usersPerPage);
    },

    totalCustomers() {
      return this.users.length;
    },
  },
});
