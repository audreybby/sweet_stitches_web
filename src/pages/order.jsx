import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import LogoutButton from "../components/LogoutButton";

const Admin = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from Firestore
  const fetchOrders = async () => {
    try {
      const ordersCollection = await getDocs(collection(db, "orders"));
      setOrders(ordersCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="pt-24 px-4 md:px-16">
      <div className="top mb-5">
        <div className="bg-pink-50 py-5 border border-pink-100 rounded-lg">
          <h1 className="text-center text-2xl font-bold text-pink-500">Admin Dashboard</h1>
          <div className="sm:ml-[300px] sm:pt-3 md:ml-[736px] md:pt-4 ml-[135px] pt-2">
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="px-5">
        <Tabs>
          <TabList className="flex flex-wrap justify-center space-x-4 md:space-x-6">
            <Tab className="p-4 sm:w-1/2 md:w-1/4 w-full cursor-pointer">
              <div className="border bg-pink-50 hover:bg-pink-100 border-pink-100 px-4 py-3 rounded-xl text-center">
                <h2 className="font-medium text-2xl text-pink-400">{orders.length}</h2>
                <p className="text-pink-500 font-bold">Total Orders</p>
              </div>
            </Tab>
          </TabList>

          <TabPanel>
            <div className="py-5">
              <h1 className="text-xl text-pink-300 font-bold mb-5">Orders</h1>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-sm md:text-base">
                  <thead>
                    <tr className="bg-pink-100">
                      <th className="py-2 px-4">S.No.</th>
                      <th className="py-2 px-4">Order ID</th>
                      <th className="py-2 px-4">Items</th>
                      <th className="py-2 px-4">Total</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.id} className="border-t">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{order.id}</td>
                        <td className="py-2 px-4">
                          <ul>
                            {order.items.map((item, i) => (
                              <li key={i}>
                                {item.name} x {item.quantity} - Rp {item.price * item.quantity}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-2 px-4">Rp {order.total}</td>
                        <td className="py-2 px-4">{order.status}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => updateOrderStatus(order.id, "Diproses")}
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, "Dikirim")}
                            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 ml-2"
                          >
                            Ship
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, "Selesai")}
                            className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 ml-2"
                          >
                            Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;