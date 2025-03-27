import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
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
    recentOrders: [],
    totalRevenue: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    monthlyRevenue: 0,
  }),

  actions: {
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

    fetchTotalCheckouts() {
      getDocs(collection(db, "checkout"))
        .then((querySnapshot) => {
          this.totalCheckouts = querySnapshot.size;
        })
        .catch((e) => {
          console.error("Error fetching total checkouts: ", e);
        });
    },

    async deleteOrder(orderId) {
      if (!orderId) {
        return;
      }
      try {
        const docRef = doc(db, "checkout", orderId);
        await deleteDoc(docRef);
        this.orders = this.orders.filter((order) => order.orderId !== orderId);
        this.updatePagination();
      } catch (error) {
        console.error("Error removing from order:", error);
      }
    },

    async fetchRecentOrders() {
      try {
        const ordersRef = collection(db, "checkout");
        const q = query(ordersRef, orderBy("date", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        this.recentOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            orderNumber: data.orderId || doc.id,
            createdAt: data.date || data.createdAt || new Date().toISOString(),
            ...data
          };
        });
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        this.recentOrders = [];
      }
    },

    async fetchRevenueMetrics() {
      try {
        const ordersRef = collection(db, "checkout");
        const querySnapshot = await getDocs(ordersRef);
        
        // Calculate total revenue
        let totalRevenue = 0;
        let orderCount = 0;
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        let monthlyRevenue = 0;
        let lastMonthRevenue = 0;

        querySnapshot.forEach(doc => {
          const order = doc.data();
          const orderTotal = order.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          totalRevenue += orderTotal;
          orderCount++;

          // Calculate monthly revenue
          const orderDate = new Date(order.date);
          if (orderDate >= firstDayOfMonth) {
            monthlyRevenue += orderTotal;
          }

          // Calculate last month's revenue for growth
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          if (orderDate >= firstDayOfLastMonth && orderDate < lastMonth) {
            lastMonthRevenue += orderTotal;
          }
        });

        // Calculate metrics
        this.totalRevenue = totalRevenue;
        this.averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
        this.monthlyRevenue = monthlyRevenue;
        
        // Calculate revenue growth
        if (lastMonthRevenue > 0) {
          this.revenueGrowth = ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else {
          this.revenueGrowth = 0;
        }
      } catch (error) {
        console.error('Error fetching revenue metrics:', error);
      }
    },
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
