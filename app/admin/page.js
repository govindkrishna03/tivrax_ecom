'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import jsPDF from 'jspdf';
const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

// Define categories and their corresponding styles
const productCategories = {
  'T-Shirts': ['Casual', 'Oversized', 'Slim Fit', 'Graphic', 'Polo'],
  'Shirts': ['Casual', 'Formal', 'Linen', 'Denim', 'Flannel'],
  'Hoodies': ['Pullover', 'Zip-up', 'Cropped', 'Oversized', 'Athletic'],
  'Pants': ['Jeans', 'Chinos', 'Sweatpants', 'Cargo', 'Joggers'],
  'Shorts': ['Casual', 'Athletic', 'Denim', 'Cargo', 'Swim'],
  'Jackets': ['Denim', 'Bomber', 'Parka', 'Leather', 'Windbreaker']
};

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [selectedTab, setSelectedTab] = useState('orders');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProductData, setEditedProductData] = useState({
    name: '',
    category: '',
    style: '',
    price: 0,
    image_url: '',
    description: '',
  });
  const [newProductSizes, setNewProductSizes] = useState([{ size: availableSizes[0], stock: 0 }]);
  const [editingSize, setEditingSize] = useState(null);
  const [editedSizeData, setEditedSizeData] = useState({});
  const [availableStyles, setAvailableStyles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
  }, []);

  // Update available styles when category changes
  useEffect(() => {
    if (editedProductData.category) {
      setAvailableStyles(productCategories[editedProductData.category] || []);
      // Reset style when category changes
      setEditedProductData(prev => ({ ...prev, style: '' }));
    }
  }, [editedProductData.category]);
  
  const handleDownloadBillPDF = async (order) => {
    try {
      const billData = {
        orderId: order.id,
        date: order.created_at,
        email: order.email,
        productId: order.product_id,
        productName: order.product_name,
        quantity: order.quantity,
        totalPrice: order.total_price,
        paymentMode: order.payment_mode,
        shippingAddress: order.shipping_address,
        orderStatus: order.order_status,
        phoneNumber: order.phone_number,
        size: order.product_size,
      };
      // Convert the date object to a more readable format if needed
      billData.date = order.created_at.toLocaleString();

      const doc = new jsPDF();

      // Add content to the PDF (adjust spacing and formatting as needed)
      doc.setFontSize(16);
      doc.text("Order Bill", 10, 10);
      doc.setFontSize(12);
      for (const key in billData) {
        doc.text(`${key}: ${billData[key]}`, 10, 20 + (Object.keys(billData).indexOf(key) * 10));
      }

      // Generate PDF filename
      const filename = `order_${order.id}_bill.pdf`;

      doc.save(filename);
    } catch (error) {
      console.error("Error generating or downloading PDF:", error);
      alert("Error generating PDF bill: " + error.message);
    }
  };

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const userEmail = session.user.email;
    if (adminEmails.includes(userEmail)) {
      setIsAuthorized(true);
      await fetchOrders();
      await fetchProducts();
    } else {
      router.push('/not-authorized');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching orders:', error.message);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data: productsData, error } = await supabase.from('products').select('*, product_sizes(*)').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error.message);
    } else {
      setProducts(productsData);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId);
      if (error) {
        alert('Error updating status: ' + error.message);
        return;
      }
      fetchOrders(); // Refresh order list
    } catch (err) {
      console.error('Unexpected error updating status:', err);
      alert('Unexpected error: ' + err.message);
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    const { error } = await supabase.from('products').update(editedProductData).eq('id', editingProduct.id);
    if (error) {
      alert('Error updating product');
      return;
    }
    fetchProducts();
    setEditingProduct(null);
    setEditedProductData({
      name: '',
      category: '',
      style: '',
      price: 0,
      image_url: '',
      description: '',
    });
  };

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      alert('Error deleting product');
      return;
    }
    fetchProducts();
  };

  const addProduct = async () => {
    // Validate that all required fields are filled
    if (!editedProductData.name || !editedProductData.category || !editedProductData.style || !editedProductData.price || !editedProductData.description) {
      alert('Please fill in all the product details.');
      return;
    }

    // Validate sizes
    for (const sizeData of newProductSizes) {
      if (!availableSizes.includes(sizeData.size)) {
        alert(`Invalid size: ${sizeData.size}. Allowed sizes are: ${availableSizes.join(', ')}`);
        return;
      }
    }

    // Add the new product to the products table
    const { data: newProduct, error: productError } = await supabase.from('products').insert([editedProductData]).select().single();
    if (productError) {
      alert('Error adding product: ' + productError.message);
      return;
    }

    // Now add sizes for the newly created product
    if (newProduct?.id) {
      const sizeInserts = newProductSizes.map(sizeData => ({
        size: sizeData.size,
        stock: sizeData.stock,
        product_id: newProduct.id,
      }));
      const { error: sizeError } = await supabase.from('product_sizes').insert(sizeInserts);
      if (sizeError) {
        alert('Error adding sizes: ' + sizeError.message);
        return;
      }
    }

    // Reset product addition state after adding the product
    setEditingProduct(null);
    setEditedProductData({
      name: '',
      category: '',
      style: '',
      price: 0,
      image_url: '',
      description: '',
      
    });
    setNewProductSizes([{ size: availableSizes[0], stock: 0 }]); // Reset sizes
    fetchProducts(); // Refresh the product list
  };

  const handleAddSizeClick = () => {
    setNewProductSizes(prevSizes => [...prevSizes, { size: availableSizes[0], stock: 0 }]);
  };

  const handleRemoveNewSize = (index) => {
    setNewProductSizes(prevSizes => prevSizes.filter((_, i) => i !== index));
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter((o) => o.payment_status === filter);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setEditingProduct(null);
    setEditingSize(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditedProductData({
      name: product.name,
      category: product.category || '',
      style: product.style || '',
      price: product.price,
      description: product.description
    });
  };

  const handleEditSize = (size) => {
    setEditingSize(size);
    setEditedSizeData({ size: size.size, stock: size.stock });
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProductData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSizeInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSizeData(prevData => ({ ...prevData, [name]: value }));
  };

  const updateSize = async () => {
    if (!editingSize) return;
    const { error } = await supabase.from('product_sizes').update(editedSizeData).eq('id', editingSize.id);
    if (error) {
      alert('Error updating size');
      return;
    }
    fetchProducts();
    setEditingSize(null);
    setEditedSizeData({});
  };

  const deleteSize = async (sizeId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this size?');
    if (!confirmDelete) return;
    const { error } = await supabase.from('product_sizes').delete().eq('id', sizeId);
    if (error) {
      alert('Error deleting size');
      return;
    }
    fetchProducts();
  };

  if (isAuthorized === null) {
    return <div className="text-center mt-10">Checking admin access...</div>;
  }

  if (!isAuthorized) {
    return <div className="text-center mt-10">Not authorized to view this page.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-8">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 rounded-md shadow-sm">
          <button
            className={`py-3 px-6 text-lg font-semibold rounded-l-md ${selectedTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => handleTabChange('orders')}
          >
            Orders
          </button>
          <button
            className={`py-3 px-6 text-lg font-semibold rounded-r-md ${selectedTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => handleTabChange('products')}
          >
            Products
          </button>
        </div>

        {/* Orders Tab Content */}
        {selectedTab === 'orders' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <label htmlFor="filter" className="text-gray-700 font-medium">Filter by Status:</label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md shadow-sm p-2 text-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <button
                onClick={fetchOrders}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                Refresh Orders
              </button>
            </div>

            {loading ? (
              <div className="text-center py-4">Loading orders...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Order ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Product ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Product Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">User Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Total Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Size</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Payment Mode</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Shipping Address</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Order Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Phone Number</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Bill</th>
                    

                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.id}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.product_id}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.product_name}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">₹{order.total_price}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.product_size}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.payment_mode}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.shipping_address}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.order_status}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{order.phone_number}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">
                          <div className="flex gap-2">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                              onClick={() => updateStatus(order.id, 'Success')}
                            >
                              Mark Success
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                              onClick={() => updateStatus(order.id, 'Failed')}
                            >
                              Mark Failed
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">
                        <button
    onClick={() => handleDownloadBillPDF(order)} // Use the new function
    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
  >
    Download PDF Bill
  </button>
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products Tab Content */}
        {selectedTab === 'products' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingProduct({});
                  setEditedProductData({
                    name: '',
                    category: '',
                    style: '',
                    price: 0,
                    image_url: '',
                    description: '',
                  });
                  setNewProductSizes([{ size: availableSizes[0], stock: 0 }]);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              >
                Add New Product
              </button>
            </div>

            {loading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : (
              <div className="space-y-6">
                {editingProduct && (
                  <div className="bg-gray-100 p-6 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h2>

                    {/* Product Name */}
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Product Name:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Product Name"
                        value={editedProductData.name || ''}
                        onChange={handleProductInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    {/* Category Dropdown */}
                    <div className="mb-4">
                      <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                      <select
                        id="category"
                        name="category"
                        value={editedProductData.category || ''}
                        onChange={handleProductInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">Select a category</option>
                        {Object.keys(productCategories).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Style Dropdown (depends on selected category) */}
                    {editedProductData.category && (
                      <div className="mb-4">
                        <label htmlFor="style" className="block text-gray-700 text-sm font-bold mb-2">Style:</label>
                        <select
                          id="style"
                          name="style"
                          value={editedProductData.style || ''}
                          onChange={handleProductInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Select a style</option>
                          {availableStyles.map(style => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        value={editedProductData.price || ''}
                        onChange={handleProductInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    {/* Image URL */}
                    <div className="mb-4">
                      <label htmlFor="image_url" className="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
                      <input
                        type="text"
                        id="image_url"
                        name="image_url"
                        placeholder="https://example.com/image.jpg"
                        value={editedProductData.image_url || ''}
                        onChange={handleProductInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      {editedProductData.image_url && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                          <img
                            src={editedProductData.image_url}
                            alt="Product preview"
                            className="h-40 object-contain border rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Product description..."
                        value={editedProductData.description || ''}
                        onChange={handleProductInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="4"
                      />
                    </div>

                    {/* Size and Stock Fields for New Products */}
                    {!editingProduct.id && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Sizes:</h3>
                        {newProductSizes.map((sizeData, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <select
                              className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                              value={sizeData.size}
                              onChange={(e) => {
                                const updatedSizes = [...newProductSizes];
                                updatedSizes[index].size = e.target.value;
                                setNewProductSizes(updatedSizes);
                              }}
                            >
                              {availableSizes.map((sizeOption) => (
                                <option key={sizeOption} value={sizeOption}>
                                  {sizeOption}
                                </option>
                              ))}
                            </select>

                            <input
                              type="number"
                              className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                              placeholder="Stock"
                              value={sizeData.stock}
                              onChange={(e) => {
                                const updatedSizes = [...newProductSizes];
                                updatedSizes[index].stock = +e.target.value;
                                setNewProductSizes(updatedSizes);
                              }}
                            />

                            {newProductSizes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveNewSize(index)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddSizeClick}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        >
                          Add Size
                        </button>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={editingProduct.id ? updateProduct : addProduct}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      >
                        {editingProduct.id ? 'Update Product' : 'Add Product'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setEditedProductData({
                            name: '',
                            category: '',
                            style: '',
                            price: 0,
                            image_url: '',
                            description: '',
                          });
                          setNewProductSizes([{ size: availableSizes[0], stock: 0 }]);
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}


                {products.map((product) => (
                  <div key={product.id} className="bg-white p-6 rounded-md shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600">₹{product.price}</p>
                        <p className="text-sm text-gray-500">{product.description}</p>
                        <p className="text-sm text-gray-500">Category: {product.category}</p>
                        <p className="text-sm text-gray-500">Style: {product.style}</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Sizes Section */}
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Sizes:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {product.product_sizes.map((size) => (
                          <div key={size.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                            <div>
                              <span className="text-sm font-semibold text-gray-800">Size: {size.size}</span>
                              <span className="ml-2 text-sm text-gray-600">Stock: {size.stock}</span>
                            </div>
                            <div className="space-x-2">
                              <button
                                onClick={() => handleEditSize(size)}
                                className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteSize(size.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;