import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import keranjang from "../assets/keranjang.png";
import order from "../assets/listorder.png";
import buyer from "../assets/buyer.png";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import LogoutButton from "../components/LogoutButton";

const compressImage = async (file, maxWidth, maxHeight) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (maxHeight / height) * width;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Image compression failed"));
                }
            }, "image/jpeg", 0.8);
        };
        img.onerror = (error) => reject(error);
    });
};

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const Admin = () => {
    const [, setUser] = useState(null);
    const [, setRole] = useState(null);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState({ name: "", price: "", category: "crochet", imageFile: null });
    const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "crochet", imageFile: null });
    const [review, setReview] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const [editedReview, setEditedReview] = useState({ description: "", imageFile: null });
    const [newReview, setNewReview] = useState({ description: "", imageFile: null });
    const [orders, setOrders] = useState([]);
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editedEvent, setEditedEvent] = useState({ name: "", price: "", category: "crochet", imageFile: null });
    const [newEvent, setNewEvent] = useState({ name: "", price: "", category: "crochet", imageFile: null });
    const [eventName, setEventName] = useState("");
    const [newEventName, setNewEventName] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRole(docSnap.data().role);
                }
            } else {
                setUser(null);
                setRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch event name from Firestore
    const fetchEventName = async () => {
        try {
            const docRef = doc(db, "events", "eventName");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setEventName(docSnap.data().name);
            }
        } catch (error) {
            console.error("Error fetching event name:", error);
        }
    };

    useEffect(() => {
        fetchEventName();
    }, []);

    // Update event name in Firestore
    const updateEventsName = async () => {
        try {
            const docRef = doc(db, "events", "eventName");
            await setDoc(docRef, { name: newEventName });
            setEventName(newEventName);
            setNewEventName("");
        } catch (error) {
            console.error("Error updating event name:", error);
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        try {
            const productsCollection = collection(db, "products");
            const productSnapshot = await getDocs(productsCollection);
            const productList = productSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productList);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch reviews
    const fetchReviews = async () => {
        try {
            const reviewsCollection = collection(db, "reviews");
            const reviewsSnapshot = await getDocs(reviewsCollection);
            const reviewsList = reviewsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setReview(reviewsList);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Fetch orders
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(price);
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
    };
    
    const closeModal = () => {
        setSelectedOrder(null);
    };

    const addProduct = async () => {
        if (newProduct.name.trim() && newProduct.price.trim() && newProduct.imageFile) {
            try {
                const file = newProduct.imageFile;
                const maxWidth = 800;
                const maxHeight = 600;

                const compressedBlob = await compressImage(file, maxWidth, maxHeight);

                const base64Image = await convertToBase64(compressedBlob);

                await addDoc(collection(db, "products"), {
                    name: newProduct.name,
                    price: newProduct.price,
                    category: newProduct.category,
                    image: base64Image,
                });

                setNewProduct({ name: "", price: "", category: "", imageFile: null });
                fetchProducts();
            } catch (error) {
                console.error("Error adding product:", error);
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setEditedProduct({ name: product.name, price: product.price, category: product.category, imageFile: null });
    };

    const updateProduct = async () => {
        if (!editingProduct) return;

        try {
            const updatedData = {
                name: editedProduct.name,
                price: editedProduct.price,
                category: editedProduct.category,
            };

            if (editedProduct.imageFile) {
                const file = editedProduct.imageFile;
                const maxWidth = 800;
                const maxHeight = 600;

                const compressedBlob = await compressImage(file, maxWidth, maxHeight);
                const base64Image = await convertToBase64(compressedBlob);

                updatedData.image = base64Image;
            }

            const productDoc = doc(db, "products", editingProduct.id);
            await updateDoc(productDoc, updatedData);
            fetchProducts();
            setEditingProduct(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    // Delete product
    const deleteProduct = async (id) => {
        try {
            const productDoc = doc(db, "products", id);
            await deleteDoc(productDoc);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // Cancel edit product
    const cancelEdit = () => {
        setEditingProduct(null);
        setEditedProduct({ name: "", price: "", category: "", imageFile: null });
    };

    // Add review
    const addReview = async () => {
        if (newReview.description?.trim() && newReview.imageFile) {
            try {
                const file = newReview.imageFile;
                const maxWidth = 800;
                const maxHeight = 600;

                // Compress the image before uploading
                const compressedBlob = await compressImage(file, maxWidth, maxHeight);

                // Convert the compressed image into base64
                const base64Image = await convertToBase64(compressedBlob);

                await addDoc(collection(db, "reviews"), {
                    description: newReview.description,
                    image: base64Image,
                });

                setNewReview({ description: "", imageFile: null });
                fetchReviews();
            } catch (error) {
                console.error("Error adding review:", error);
            }
        }
    };

    // Edit review
    const editReview = (review) => {
        setEditingReview(review);
        setEditedReview({ description: review.description, imageFile: null });
    };

    // Update review
    const updateReview = async () => {
        if (!editingReview) return;

        try {
            const updatedData = {
                description: editedReview.description,
            };

            if (editedReview.imageFile) {
                const file = editedReview.imageFile;
                const maxWidth = 800;
                const maxHeight = 600;

                // Compress the image before updating
                const compressedBlob = await compressImage(file, maxWidth, maxHeight);
                const base64Image = await convertToBase64(compressedBlob);

                updatedData.image = base64Image; // Use base64 image
            }

            const reviewDoc = doc(db, "reviews", editingReview.id);
            await updateDoc(reviewDoc, updatedData);
            fetchReviews();
            setEditingReview(null);
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };

    // Delete review
    const deleteReview = async (id) => {
        try {
            const reviewDoc = doc(db, "reviews", id);
            await deleteDoc(reviewDoc);
            fetchReviews();
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    // Cancel edit review
    const cancelEditReview = () => {
        setEditingReview(null);
        setEditedReview({ description: "", imageFile: null });
    };

     // Fetch events
     const fetchEvents = async () => {
        try {
            const eventsCollection = collection(db, "events");
            const eventSnapshot = await getDocs(eventsCollection);
            const eventList = eventSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                price: Number(doc.data().price),
            }));
            setEvents(eventList);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Add events
    const addEvent = async () => {
        if (newEvent.name.trim() && newEvent.price.trim() && newEvent.imageFile) {
            try {
                const file = newEvent.imageFile;
                const maxWidth = 800;
                const maxHeight = 600;

                // Compress the image before uploading
                const compressedBlob = await compressImage(file, maxWidth, maxHeight);

                // Convert the compressed image into base64
                const base64Image = await convertToBase64(compressedBlob);

                await addDoc(collection(db, "events"), {
                    name: newEvent.name,
                    price: newEvent.price,
                    category: newEvent.category,
                    image: base64Image,  // Use base64 image
                });

                setNewEvent({ name: "", price: "", category: "", imageFile: null });
                fetchEvents();
            } catch (error) {
                console.error("Error adding product:", error);
            }
        }
    };

    // Edit events
    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setEditedEvent({ name: event.name, price: event.price, category: event.category, imageFile: null });
    };

    // Update events
    const updateEvent = async () => {
        if (!editingEvent) return;

        try {
            const updatedData = {
                name: editedEvent.name,
                price: editedEvent.price,
                category: editedEvent.category,
            };

            if (editedEvent.imageFile) {
                const file = editedEvent.imageFile;
                const maxWidth = 800;
                const maxHeight = 600;

                // Compress the image before updating
                const compressedBlob = await compressImage(file, maxWidth, maxHeight);
                const base64Image = await convertToBase64(compressedBlob);

                updatedData.image = base64Image; // Use base64 image
            }

            const eventDoc = doc(db, "events", editingEvent.id);
            await updateDoc(eventDoc, updatedData);
            fetchEvents();
            setEditingEvent(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    // Delete events
    const deleteEvent = async (id) => {
        try {
            const eventDoc = doc(db, "events", id);
            await deleteDoc(eventDoc);
            fetchEvents();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // Cancel edit event
    const cancelEditEvent = () => {
        setEditingEvent(null);
        setEditedEvent({ name: "", price: "", category: "", imageFile: null });
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
                    <TabList className="flex flex-wrap justify-center">
                        <Tab className="p-4  w-1/2 sm:w-1/2 md:w-1/4 cursor-pointer">
                            <div className="border bg-pink-50 hover:bg-pink-100 border-pink-100 px-4 py-3 rounded-xl text-center">
                                <img src={keranjang} alt="" className="text-pink-500 w-12 h-12 mb-3 inline-block" />
                                <h2 className="font-medium text-2xl text-pink-400">{products.length}</h2>
                                <p className="text-pink-500 font-bold">Products</p>
                            </div>
                        </Tab>
                        <Tab className="p-4  w-1/2 sm:w-1/2 md:w-1/4 cursor-pointer">
                            <div className="border bg-pink-50 hover:bg-pink-100 border-pink-100 px-4 py-3 rounded-xl text-center">
                                <img src={buyer} alt="" className="text-pink-500 w-12 h-12 mb-3 inline-block" />
                                <h2 className="font-medium text-2xl text-pink-400">{review.length}</h2>
                                <p className="text-pink-500 font-bold">Reviews</p>
                            </div>
                        </Tab>
                        <Tab className="p-4  w-1/2 sm:w-1/2 md:w-1/4 cursor-pointer">
                            <div className="border bg-pink-50 hover:bg-pink-100 border-pink-100 px-4 py-3 rounded-xl text-center">
                                <img src={order} alt="" className="text-pink-500 w-12 h-12 mb-3 inline-block" />
                                <h2 className="font-medium text-2xl text-pink-400">{orders.length}</h2>
                                <p className="text-pink-500 font-bold">Orders</p>
                            </div>
                        </Tab>
                        <Tab className="p-4  w-1/2 sm:w-1/2 md:w-1/4 cursor-pointer">
                            <div className="border bg-pink-50 hover:bg-pink-100 border-pink-100 px-4 py-3 rounded-xl text-center">
                                <img src={keranjang} alt="" className="text-pink-500 w-12 h-12 mb-3 inline-block" />
                                <h2 className="font-medium text-2xl text-pink-400">{events.length}</h2>
                                <p className="text-pink-500 font-bold">Events</p>
                            </div>
                        </Tab>
                    </TabList>

                    <TabPanel>
                        <div className="py-5">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 space-y-4 sm:space-y-0">
                                <h1 className="text-xl text-pink-300 font-bold">All Products</h1>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Price"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
                                        className="border p-2 rounded-md"
                                    />
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="border p-2 rounded-md"
                                    >
                                        <option value="crochet">Crochet</option>
                                        <option value="cake">Cake</option>
                                    </select>
                                    <button
                                        onClick={addProduct}
                                        className="bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600"
                                    >
                                        Add Product
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table-auto w-full text-sm md:text-base">
                                    <thead>
                                        <tr className="bg-pink-100">
                                            <th className="py-2 px-4">S.No.</th>
                                            <th className="py-2 px-4">Image</th>
                                            <th className="py-2 px-4">Name</th>
                                            <th className="py-2 px-4">Price</th>
                                            <th className="py-2 px-4">Category</th>
                                            <th className="py-2 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
                                            <tr key={product.id} className="border-t">
                                                <td className="py-2 px-4">{index + 1}</td>
                                                <td className="py-2 px-4">
                                                    {product.image && <img src={product.image} alt={product.name} className="h-16 w-16 object-cover" />}
                                                </td>
                                                <td className="py-2 px-4">{product.name}</td>
                                                <td className="py-2 px-4">{product.price}</td>
                                                <td className="py-2 px-4">{product.category}</td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 ml-2"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="py-5">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 space-y-4 sm:space-y-0">
                                <h1 className="text-xl text-pink-300 font-bold">Reviews</h1>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Review Description"
                                        value={newReview.description}
                                        onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewReview({ ...newReview, imageFile: e.target.files[0] })}
                                        className="border p-2 rounded-md"
                                    />
                                    <button
                                        onClick={addReview}
                                        className="bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600"
                                    >
                                        Add Review
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table-auto w-full text-sm md:text-base">
                                    <thead>
                                        <tr className="bg-pink-100">
                                            <th className="py-2 px-4">S.No.</th>
                                            <th className="py-2 px-4">Image</th>
                                            <th className="py-2 px-4">Description</th>
                                            <th className="py-2 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {review.map((review, index) => (
                                            <tr key={review.id} className="border-t">
                                                <td className="py-2 px-4">{index + 1}</td>
                                                <td className="py-2 px-4">
                                                    {review.image && <img src={review.image} alt={review.description} className="h-16 w-16 object-cover" />}
                                                </td>
                                                <td className="py-2 px-4">{review.description}</td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        onClick={() => editReview(review)}
                                                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteReview(review.id)}
                                                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 ml-2"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabPanel>

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
                                            <td
                                                className="py-2 px-4 text-blue-500 cursor-pointer hover:underline"
                                                onClick={() => openOrderDetails(order)}
                                            >
                                                {order.id}
                                            </td>
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

                                {selectedOrder && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-5 rounded-lg w-96">
                                        <h2 className="text-xl font-bold mb-3">Order Details</h2>
                                        <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                                        <p><strong>Phone Number:</strong> {selectedOrder.phoneNumber}</p>
                                        <p><strong>Address:</strong> {selectedOrder.address}</p>
                                        <p><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
                                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                                        <h3 className="mt-3 font-semibold">Items:</h3>
                                        <ul>
                                        {selectedOrder.items.map((item, index) => (
                                            <li key={index}>
                                            {item.name} x {item.quantity} - {formatPrice(item.price * item.quantity)}
                                            </li>
                                        ))}
                                        </ul>
                                        <button
                                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        onClick={closeModal}
                                        >
                                        Close
                                        </button>
                                    </div>
                                    </div>
                                )}
                              </TabPanel>

                    <TabPanel>
                    <div className="py-5">
                            <h1 className="text-xl text-pink-300 font-bold mb-3">Event Name</h1>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newEventName}
                                    onChange={(e) => setNewEventName(e.target.value)}
                                    placeholder="Enter new event name"
                                    className="border p-2 rounded-md w-1/2"
                                />
                                <button onClick={updateEventsName} className="bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600">
                                    Update Event Name
                                </button>
                            </div>
                            <p className="text-lg mt-2"><strong>Current Event:</strong> {eventName}</p>
                        </div>
                        <div className="py-5">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 space-y-4 sm:space-y-0">
                                <h1 className="text-xl text-pink-300 font-bold">All Events</h1>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Event Name"
                                        value={newEvent.name}
                                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Price"
                                        value={newEvent.price}
                                        onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                                        className="border p-2 rounded-md"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewEvent({ ...newEvent, imageFile: e.target.files[0] })}
                                        className="border p-2 rounded-md"
                                    />
                                    <select
                                        value={newEvent.category}
                                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        className="border p-2 rounded-md"
                                    >
                                        <option value="crochet">Crochet</option>
                                        <option value="cake">Cake</option>
                                    </select>
                                    <button
                                        onClick={addEvent}
                                        className="bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600"
                                    >
                                        Add Product
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table-auto w-full text-sm md:text-base">
                                    <thead>
                                        <tr className="bg-pink-100">
                                            <th className="py-2 px-4">S.No.</th>
                                            <th className="py-2 px-4">Image</th>
                                            <th className="py-2 px-4">Name</th>
                                            <th className="py-2 px-4">Price</th>
                                            <th className="py-2 px-4">Category</th>
                                            <th className="py-2 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((event, index) => (
                                            <tr key={event.id} className="border-t">
                                                <td className="py-2 px-4">{index + 1}</td>
                                                <td className="py-2 px-4">
                                                    {event.image && <img src={event.image} alt={event.name} className="h-16 w-16 object-cover" />}
                                                </td>
                                                <td className="py-2 px-4">{event.name}</td>
                                                <td className="py-2 px-4">{event.price}</td>
                                                <td className="py-2 px-4">{event.category}</td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        onClick={() => handleEditEvent(event)}
                                                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteEvent(event.id)}
                                                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 ml-2"
                                                    >
                                                        Delete
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

            {editingProduct && (
                <div className="modal bg-gray-800 bg-opacity-50 fixed inset-0 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md w-full max-w-lg">
                        <h2>Edit Product</h2>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={editedProduct.name}
                                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                                className="border p-2 rounded-md w-full"
                            />
                        </label>
                        <label>
                            Price:
                            <input
                                type="text"
                                value={editedProduct.price}
                                onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                                className="border p-2 rounded-md w-full"
                            />
                        </label>
                        <label>
                            Category:
                            <select
                                value={editedProduct.category}
                                onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                                className="border p-2 rounded-md w-full"
                            >
                                <option value="crochet">Crochet</option>
                                <option value="cake">Cake</option>
                            </select>
                        </label>
                        <label>
                            Image:
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setEditedProduct({ ...editedProduct, imageFile: e.target.files[0] })
                                }
                                className="border p-2 rounded-md"
                            />
                        </label>
                        <div className="mt-4">
                            <button
                                onClick={updateProduct}
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            >
                                Update Product
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingReview && (
                <div className="modal bg-gray-800 bg-opacity-50 fixed inset-0 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md w-full max-w-lg">
                        <h2>Edit Review</h2>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={editedReview.description}
                                onChange={(e) => setEditedReview({ ...editedReview, description: e.target.value })}
                                className="border p-2 rounded-md w-full"
                            />
                        </label>
                        <label>
                            Image:
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setEditedReview({ ...editedReview, imageFile: e.target.files[0] })
                                }
                                className="border p-2 rounded-md"
                            />
                        </label>
                        <div className="mt-4">
                            <button
                                onClick={updateReview}
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            >
                                Update Review
                            </button>
                            <button
                                onClick={cancelEditReview}
                                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingEvent && (
                <div className="modal bg-gray-800 bg-opacity-50 fixed inset-0 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md w-full max-w-lg">
                        <h2>Edit Event</h2>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={editedEvent.name}
                                onChange={(e) => setEditedEvent({ ...editedEvent, name: e.target.value })}
                                className="border p-2 rounded-md w-full"
                            />
                        </label>
                        <label>
                            Price:
                            <input
                                type="text"
                                value={editedEvent.price}
                                onChange={(e) => setEditedEvent({ ...editedEvent, price: e.target.value })}
                                className="border p-2 rounded-md w-full"
                            />
                        </label>
                        <label>
                            Category:
                            <select
                                value={editedEvent.category}
                                onChange={(e) => setEditedEvent({ ...editedEvent, category: e.target.value })}
                                className="border p-2 rounded-md w-full"
                            >
                                <option value="crochet">Crochet</option>
                                <option value="cake">Cake</option>
                            </select>
                        </label>
                        <label>
                            Image:
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setEditedEvent({ ...editedEvent, imageFile: e.target.files[0] })
                                }
                                className="border p-2 rounded-md"
                            />
                        </label>
                        <div className="mt-4">
                            <button
                                onClick={updateEvent}
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            >
                                Update Product
                            </button>
                            <button
                                onClick={cancelEditEvent}
                                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;