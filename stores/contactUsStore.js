import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export const useContactStore = defineStore("contact", {
  state: () => ({
    yourName: "",
    email: "",
    message: "",
    messages: [],
    paginatedMessages: [],
    currentPage: 1,
    messagesPerPage: 5,
  }),

  actions: {
    submitForm(contactData) {
      const authStore = useAuthStore();
      const uid = authStore.user?.uid;
      const currentDate = new Date().toLocaleDateString("en-CA");
      return addDoc(collection(db, "contact-us"), {
        name: contactData.yourName,
        email: contactData.email,
        message: contactData.message,
        date: currentDate,
        uid,
      })
        .then(() => {
          console.log("Message saved");
        })
        .catch((e) => {
          // console.error("Error saving message:", e);
          throw e;
        });
    },

    fetchMessages() {
      getDocs(collection(db, "contact-us"))
        .then((querySnapshot) => {
          const messages = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.messages = messages;
          // console.log(messages);
          this.updatePagination();
        })
        .catch((e) => {
          // console.log("Error fetching messages: ", e);
          throw e;
        });
    },

    updatePagination() {
      this.paginatedMessages = this.messages.slice(
        (this.currentPage - 1) * this.messagesPerPage,
        this.currentPage * this.messagesPerPage
      );
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },

    deleteMessage(messageId) {
      if (!messageId) {
        // console.warn("Message ID is not provided.");
        return Promise.resolve();
      }
      const docRef = doc(db, "contact-us", messageId);
      return deleteDoc(docRef)
        .then(() => {
          this.messages = this.messages.filter(
            (message) => message.id !== messageId
          );
          this.updatePagination();
          // console.log("Message deleted successfully.");
        })
        .catch((error) => {
          // console.error("Error deleting message:", error);
          throw error;
        });
    },

    replyToMessage(messageId, replyText) {
      if (!messageId) {
        return Promise.reject(new Error("Invalid message ID"));
      }
      const messageDocRef = doc(db, "contact-us", messageId);
      return updateDoc(messageDocRef, {
        reply: replyText,
        repliedAt: new Date(),
      })
        .then(() => {
          const updateLocalMessage = (messagesArr) => {
            const index = messagesArr.findIndex((m) => m.id === messageId);
            if (index !== -1) {
              messagesArr[index].reply = replyText;
              messagesArr[index].repliedAt = new Date();
            }
          };
          updateLocalMessage(this.messages);
          updateLocalMessage(this.paginatedMessages);
          return true;
        })
        .catch((error) => {
          // console.error("Error replying to message:", error);
          throw error;
          return false;
        });
    },
  },

  getters: {
    allMessages: (state) => state.messages,
    totalPages() {
      return Math.ceil(this.messages.length / this.messagesPerPage);
    },
  },
});
