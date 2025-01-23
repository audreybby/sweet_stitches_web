import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import keranjang from "../assets/keranjang.png";
import order from "../assets/listorder.png";
import buyer from "../assets/buyer.png";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import LogoutButton from "../components/LogoutButton";

// Function to compress the image
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
            }, "image/jpeg", 0.8); // Adjust quality here
        };
        img.onerror = (error) => reject(error);
    });
};

// Convert the image to Base64
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);  // Read the file as base64
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const Admin = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState({ name: "", price: "", category: "crochet", imageFile: null });
    const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "crochet", imageFile: null });
    const [review, setReview] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const [editedReview, setEditedReview] = useState({ description: "", imageFile: null });
    const [newReview, setNewReview] = useState({ description: "", imageFile: null });

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

    //PRODUCT
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

    //REVIEW
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
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const addProduct = async () => {
        if (newProduct.name.trim() && newProduct.price.trim() && newProduct.imageFile) {
            try {
                const file = newProduct.imageFile;
                const maxWidth = 800;
                const maxHeight = 600;

                // Compress the image before uploading
                const compressedBlob = await compressImage(file, maxWidth, maxHeight);

                // Convert the compressed image into base64
                const base64Image = await convertToBase64(compressedBlob);

                await addDoc(collection(db, "products"), {
                    name: newProduct.name,
                    price: newProduct.price,
                    category: newProduct.category,
                    image: base64Image,  // Use base64 image
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

                // Compress the image before updating
                const compressedBlob = await compressImage(file, maxWidth, maxHeight);
                const base64Image = await convertToBase64(compressedBlob);

                updatedData.image = base64Image; // Use base64 image
            }

            const productDoc = doc(db, "products", editingProduct.id);
            await updateDoc(productDoc, updatedData);
            fetchProducts();
            setEditingProduct(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const productDoc = doc(db, "products", id);
            await deleteDoc(productDoc);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setEditedProduct({ name: "", price: "", category: "", imageFile: null });
    };

    //REVIEW
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

    const editReview = (review) => {
        setEditingReview(review);
        setEditedReview({ description: review.description, imageFile: null });
    };

    const updateReview = async () => {
        if (!editingReview) return;

        try {
            const updatedData = {
                description: editedReview.description,
            };

            if (editedProduct.imageFile) {
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

    const deleteReview = async (id) => {
        try {
            const reviewDoc = doc(db, "reviews", id);
            await deleteDoc(reviewDoc);
            fetchReviews();
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const cancelEditReview = () => {
        setEditingReview(null);
        setEditedReview({ description: "", imageFile: null });
    };

    return (
        <div className="pt-24 px-4 md:px-16">
            <div className="top mb-5">
                <div className="bg-pink-50 py-5 border border-pink-100 rounded-lg">
                    <h1 className="text-center text-2xl font-bold text-pink-500">Admin Dashboard</h1>
                    <LogoutButton/>
                    {/* <button
                        onClick={() => {
                            auth.signOut();
                            setUser(null);
                            setRole(null);
                            navigate('/');
                        }}
                        className="bg-red-500 px-4 py-2 rounded text-white"
                    >
                        Logout
                    </button> */}
                </div>
            </div>
            <div className="px-5">
                <Tabs>
                    <TabList className="flex flex-wrap justify-center space-x-4 md:space-x-6">
                        <Tab className="p-4 sm:w-1/2 md:w-1/4 w-full cursor-pointer">
                            <div className="border bg-pink-50 hover:bg-pink-100 border-pink-100 px-4 py-3 rounded-xl text-center">
                                <img src={keranjang} alt="" className="text-pink-500 w-12 h-12 mb-3 inline-block" />
                                <h2 className="font-medium text-2xl text-pink-400">{products.length}</h2>
                                <p className="text-pink-500 font-bold">Total Products</p>
                            </div>
                        </Tab>
                        <Tab className="p-4 sm:w-1/2 md:w-1/4 w-full cursor-pointer">
                            <div className="border bg-pink-50 hover:bg-pink-100 border-pink-100 px-4 py-3 rounded-xl text-center">
                                <img src={buyer} alt="" className="text-pink-500 w-12 h-12 mb-3 inline-block" />
                                <h2 className="font-medium text-2xl text-pink-400">{review.length}</h2>
                                <p className="text-pink-500 font-bold">Reviews</p>
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
                    
                    {/* REVIEWS */}
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
                </Tabs>
            </div>

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
        </div>
    );
};

export default Admin;