import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

export const useCheckoutStore = defineStore("checkout", {
  state: () => ({
    orders: [],
    paginatedOrders: [],
    currentPage: 1,
    ordersPerPage: 6,
    deliveryDetails: {
      name: "",
      email: "",
      country: "",
      city: "",
      phoneNumber: "",
    },
    paymentDetails: {
      fullNameOnCard: "",
      cardNumber: "",
      cardExpiration: "",
      cvv: "",
    },
    totalCheckouts: 0,
    status: [],
  }),

  actions: {
    // async fetchStatus() {
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "order-status"));
    //     const fetchedStatuses = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     const statusOrder = {
    //       "Order Placed": 1,
    //       Processing: 2,
    //       Shipped: 3,
    //       "Out for Delivery": 4,
    //       Delivered: 5,
    //     };
    //     this.status = fetchedStatuses.sort((a, b) => {
    //       const orderA = statusOrder[a.status] ?? Infinity;
    //       const orderB = statusOrder[b.status] ?? Infinity;
    //       return orderA - orderB;
    //     });
    //     this.updatePagination();
    //   } catch (e) {
    //     console.error("Error fetching orders: ", e);
    //   }
    // },
    fetchStatus() {
      getDocs(collection(db, "order-status"))
        .then((querySnapshot) => {
          const fetchedStatuses = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const statusOrder = {
            "Order Placed": 1,
            Processing: 2,
            Shipped: 3,
            "Out for Delivery": 4,
            Delivered: 5,
          };
          this.status = fetchedStatuses.sort((a, b) => {
            const orderA = statusOrder[a.status] ?? Infinity;
            const orderB = statusOrder[b.status] ?? Infinity;
            return orderA - orderB;
          });
          this.updatePagination();
        })
        .catch((e) => {
          console.error("Error fetching orders: ", e);
        });
    },
    // async fetchStatus() {
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "order-status"));
    //     const fetchedStatuses = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     const statusOrder = {
    //       'Order Placed': 2,
    //       'Processing': 1,
    //       'Shipped': 3,
    //       'Out for Delivery': 4,
    //       'Delivered': 0,
    //     };
    //     this.status = fetchedStatuses.sort((a, b) => {
    //       const orderA = statusOrder[a.status] ?? Infinity;
    //       const orderB = statusOrder[b.status] ?? Infinity;
    //       return orderA - orderB;
    //     });
    //     // console.log(this.orders);
    //     this.updatePagination();
    //     // await this.fetchTotalCheckouts();
    //   } catch (e) {
    //     console.error("Error fetching orders: ", e);
    //   }
    // },

    fetchOrders() {
      getDocs(query(collection(db, "checkout")))
        .then((querySnapshot) => {
          this.orders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.updatePagination();
          return this.fetchTotalCheckouts();
        })
        .catch((e) => {
          console.error("Error fetching orders: ", e);
        });
    },
    // async fetchOrders() {
    //   try {
    //     const ordersQuery = query(collection(db, "checkout"));
    //     const querySnapshot = await getDocs(ordersQuery);
    //     this.orders = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     // console.log("orders", this.orders);
    //     this.updatePagination();
    //     await this.fetchTotalCheckouts();
    //   } catch (e) {
    //     console.error("Error fetching orders: ", e);
    //   }
    // },

    fetchUserOrders() {
      const user = JSON.parse(localStorage.getItem("user"));
      const uid = user?.uid;
      if (!uid) {
        // console.error("User is not authenticated");
        return;
      }
      getDocs(query(collection(db, "checkout"), where("uid", "==", uid)))
        .then((querySnapshot) => {
          this.orders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.updatePagination();
          return this.fetchTotalCheckouts();
        })
        .catch((e) => {
          console.error("Error fetching orders: ", e);
        });
    },
    // async fetchUserOrders() {
    //   const user = JSON.parse(localStorage.getItem("user"));
    //   const uid = user?.uid;
    //   // console.log("user uid", uid);
    //   if (!uid) {
    //     console.error("User is not authenticated");
    //     return;
    //   }
    //   try {
    //     const ordersQuery = query(
    //       collection(db, "checkout"),
    //       where("uid", "==", uid)
    //     );
    //     const querySnapshot = await getDocs(ordersQuery);
    //     this.orders = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     // console.log("orders", this.orders);
    //     this.updatePagination();
    //     await this.fetchTotalCheckouts();
    //   } catch (e) {
    //     console.error("Error fetching orders: ", e);
    //   }
    // },

    updatePagination() {
      this.paginatedOrders = this.orders.slice(
        (this.currentPage - 1) * this.ordersPerPage,
        this.currentPage * this.ordersPerPage
      );
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },

    updateOrderStatus(orderId, newStatus) {
      updateDoc(doc(collection(db, "checkout"), orderId), {
        statusId: newStatus,
      })
        .then(() => {
          const orderIndex = this.orders.findIndex(
            (order) => order.id === orderId
          );
          if (orderIndex !== -1) {
            this.orders[orderIndex].statusId = newStatus;
          }
          this.updatePagination();
        })
        .catch((error) => {
          console.error("Error updating order status:", error);
        });
    },
    // async updateOrderStatus(orderId, newStatus) {
    //   try {
    //     const orderRef = doc(collection(db, "checkout"), orderId);
    //     await updateDoc(orderRef, { statusId: newStatus });
    //     const orderIndex = this.orders.findIndex(
    //       (order) => order.id === orderId
    //     );
    //     if (orderIndex !== -1) {
    //       this.orders[orderIndex].statusId = newStatus;
    //     }
    //     this.updatePagination();
    //   } catch (error) {
    //     // console.error("Error updating order status:", error);
    //     throw error;
    //   }
    // },

    generateOrderId() {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 10000);
      return `ship-${timestamp}-${randomNum}`;
    },

    saveCheckoutData(cartData) {
      const authStore = useAuthStore();
      const uid = authStore.user?.uid;
      const generateEstimatedDeliveryDate = () => {
        const randomDays = Math.floor(Math.random() * 8) + 7;
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + randomDays);
        return estimatedDate.toLocaleDateString("en-CA");
      };
      const orderId = this.generateOrderId();
      const currentDate = new Date().toLocaleDateString("en-CA");
      const estimatedDelivery = generateEstimatedDeliveryDate();
      const order = {
        orderId,
        uid,
        deliveryDetails: this.deliveryDetails,
        paymentDetails: this.paymentDetails,
        cart: cartData,
        date: currentDate,
        estimatedDelivery,
        statusId: "Y7fsSrVJlS07AeucrkcX",
      };
      addDoc(collection(db, "checkout"), order)
        .then((docRef) => {
          // console.log("Checkout data saved with ID:", docRef.id);
        })
        .catch((e) => {
          console.error("Error adding document:", e);
        });
    },
    // async saveCheckoutData(cartData) {
    //   const authStore = useAuthStore();
    //   const uid = authStore.user?.uid;
    //   const generateEstimatedDeliveryDate = () => {
    //     const randomDays = Math.floor(Math.random() * 8) + 7;
    //     const estimatedDate = new Date();
    //     estimatedDate.setDate(estimatedDate.getDate() + randomDays);
    //     return estimatedDate.toLocaleDateString("en-CA");
    //   };
    //   try {
    //     const orderId = this.generateOrderId();
    //     const currentDate = new Date().toLocaleDateString("en-CA");
    //     const estimatedDelivery = generateEstimatedDeliveryDate();
    //     const order = {
    //       orderId,
    //       uid,
    //       deliveryDetails: this.deliveryDetails,
    //       paymentDetails: this.paymentDetails,
    //       cart: cartData,
    //       date: currentDate,
    //       estimatedDelivery,
    //       statusId: "Y7fsSrVJlS07AeucrkcX",
    //     };
    //     const docRef = await addDoc(collection(db, "checkout"), order);
    //     // console.log("Checkout data saved with ID:", docRef.id);
    //   } catch (e) {
    //     console.error("Error adding document:", e);
    //   }
    // },

    fetchTotalCheckouts() {
      getDocs(collection(db, "checkout"))
        .then((querySnapshot) => {
          this.totalCheckouts = querySnapshot.size;
        })
        .catch((e) => {
          console.error("Error fetching total checkouts: ", e);
        });
    },
    // async fetchTotalCheckouts() {
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "checkout"));
    //     this.totalCheckouts = querySnapshot.size;
    //   } catch (e) {
    //     console.error("Error fetching total checkouts: ", e);
    //   }
    // },

    deleteOrder(orderId) {
      if (!orderId) {
        return;
      }
      deleteDoc(doc(db, "checkout", orderId))
        .then(() => {
          this.orders = this.orders.filter(
            (order) => order.orderId !== orderId
          );
          this.updatePagination();
        })
        .catch((error) => {
          console.error("Error removing from order:", error);
        });
    },
    // async deleteOrder(orderId) {
    //   if (!orderId) {
    //     return;
    //   }
    //   try {
    //     const docRef = doc(db, "checkout", orderId);
    //     await deleteDoc(docRef);
    //     this.orders = this.orders.filter((order) => order.orderId !== orderId);
    //     this.updatePagination();
    //   } catch (error) {
    //     console.error("Error removing from order:", error);
    //   }
    // },
  },

  getters: {
    getOrders(state) {
      return state.orders;
    },

    getDeliveryDetails(state) {
      return state.deliveryDetails;
    },

    getPaymentDetails(state) {
      return state.paymentDetails;
    },

    getTotalCheckouts(state) {
      return state.totalCheckouts;
    },

    totalPages() {
      return Math.ceil(this.orders.length / this.ordersPerPage);
    },
  },
});
