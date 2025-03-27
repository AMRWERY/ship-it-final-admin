import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";

export const useTodayDealStore = defineStore("todayDealStore", {
  state: () => ({
    products: [],
    currentDeal: null,
    nextDeals: [],
  }),

  actions: {
    fetchDeals() {
      const dealsRef = collection(db, "today-deal");
      const dealsQuery = query(dealsRef, orderBy("startTime"));
      return getDocs(dealsQuery)
        .then((snapshot) => {
          this.products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.setActiveDeal();
          this.setNextDeals();
        })
        .catch((error) => {
          console.error("Error fetching deals:", error);
        });
    },

    setActiveDeal() {
      const now = new Date();
      const activeDeal = this.products.find(
        (product) =>
          new Date(product.startTime.seconds * 1000) <= now &&
          new Date(product.endTime.seconds * 1000) > now
      );
      this.currentDeal = activeDeal || null;
    },

    setNextDeals() {
      const now = new Date();
      this.nextDeals = this.products.filter(
        (product) => new Date(product.startTime.seconds * 1000) > now
      );
      // console.log('next deal', this.nextDeals)
    },

    startDealTimer() {
      setInterval(() => {
        this.setActiveDeal();
        this.setNextDeals();
      }, 1000);
    },

    addNewDeal(dealData, imageFiles) {
      if (!imageFiles || imageFiles.length < 1) {
        return Promise.reject(
          new Error("At least one image file is required.")
        );
      }
      const imageUploadPromises = imageFiles.map((imageFile) => {
        const storagePath = "/deals/" + imageFile.name;
        const storageRef = ref(storage, storagePath);
        return uploadBytes(storageRef, imageFile).then((snapshot) =>
          getDownloadURL(snapshot.ref)
        );
      });
      return Promise.all(imageUploadPromises)
        .then((imageUrls) => {
          const imageUrlsObj = imageUrls.reduce((acc, url, index) => {
            acc[`imageUrl${index + 1}`] = url;
            return acc;
          }, {});
          const newDeal = {
            ...dealData,
            ...imageUrlsObj,
          };
          const dealsRef = collection(db, "today-deal");
          return addDoc(dealsRef, newDeal);
        })
        .then(() => this.fetchDeals())
        .then(() => true)
        .catch((error) => {
          console.error("Error adding new deal:", error);
          return false;
        });
    },

    async deleteDeal(dealId) {
      try {
        const dealRef = doc(db, "today-deal", dealId);
        await deleteDoc(dealRef);
        await this.fetchDeals(); // Refresh the deals list
        return true;
      } catch (error) {
        console.error("Error deleting deal:", error);
        throw error;
      }
    },

    async updateDeal(dealId, dealData) {
      try {
        const dealRef = doc(db, "today-deal", dealId);
        await updateDoc(dealRef, dealData);
        await this.fetchDeals(); // Refresh the deals list
        return true;
      } catch (error) {
        console.error("Error updating deal:", error);
        throw error;
      }
    },

    async addDeal(dealData) {
      try {
        const dealsRef = collection(db, "today-deal");
        await addDoc(dealsRef, dealData);
        await this.fetchDeals(); // Refresh the deals list
        return true;
      } catch (error) {
        console.error("Error adding deal:", error);
        throw error;
      }
    },
  },
});
