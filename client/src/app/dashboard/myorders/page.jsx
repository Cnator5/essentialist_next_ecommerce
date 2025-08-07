"use client"
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NoData from '../../../components/NoData';
import { format } from 'date-fns';
import { DisplayPriceInRupees } from '../../../utils/DisplayPriceInRupees';

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'CASH ON DELIVERY':
        return 'bg-orange-100 text-orange-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy · h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Group orders by orderId for the new order model
  const groupedOrders = orders.reduce((acc, order) => {
    // Check if this is a new model order with products array
    if (order.products && Array.isArray(order.products)) {
      // It's a new model order
      acc.push(order);
    } else {
      // It's an old model order, find if we already have this orderId
      const existingOrder = acc.find(o => o.orderId === order.orderId);
      if (existingOrder) {
        // Add to existing products if there's already an array
        if (!existingOrder.products) existingOrder.products = [];
        existingOrder.products.push({
          productId: order.productId,
          product_details: order.product_details,
          quantity: 1,
          price: order.totalAmt
        });
      } else {
        // Create a new entry with a products array
        acc.push({
          ...order,
          products: [{
            productId: order.productId,
            product_details: order.product_details,
            quantity: 1,
            price: order.totalAmt
          }]
        });
      }
    }
    return acc;
  }, []);

  // For empty state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white shadow-md p-8 rounded-lg flex justify-center items-center">
          <div className="loader-lg mr-3"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className='bg-white shadow-md p-5 font-semibold mb-4 rounded-md'>
          <h1 className="text-xl">My Orders</h1>
        </div>
        <NoData message="You haven't placed any orders yet" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className='bg-white shadow-md p-5 font-semibold mb-4 rounded-md flex items-center justify-between'>
        <h1 className="text-xl">My Orders</h1>
        <span className="text-sm text-gray-500">Showing {groupedOrders.length} orders</span>
      </div>

      <div className="space-y-4">
        {groupedOrders.map((order) => {
          const isExpanded = expandedOrderId === order._id;
          const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
          const formattedDate = formatDate(orderDate);
          const totalProductCount = order.products?.reduce((sum, product) => sum + (product.quantity || 1), 0) || 0;
          
          // Get a representative product for display
          const firstProduct = order.products?.[0]?.product_details || { name: 'Unknown Product', image: [''] };
          
          return (
            <div key={order._id} className='bg-white rounded-lg shadow-md overflow-hidden'>
              {/* Order header */}
              <div className="bg-gray-50 p-4 border-b flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500 text-sm">Order ID:</span>
                    <span className="font-medium">{order.orderId}</span>
                  </div>
                  <div className="text-sm text-gray-500">{formattedDate}</div>
                </div>
                
                <div className="mt-2 md:mt-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.payment_status)}`}>
                    {order.payment_status || "Processing"}
                  </span>
                  <span className="text-sm font-medium">
                    Total: {DisplayPriceInRupees(order.totalAmt)}
                  </span>
                </div>
              </div>

              {/* Order summary */}
              <div className="p-4">
                <div className='flex items-start gap-4'>
                  <div className="flex-shrink-0">
                    {order.products && order.products.length > 0 ? (
                      <div className="relative">
                        <img
                          src={firstProduct.image?.[0] || '/placeholder-image.jpg'} 
                          alt={firstProduct.name}
                          className='w-20 h-20 object-cover rounded'
                        />
                        {order.products.length > 1 && (
                          <span className="absolute -right-2 -bottom-2 bg-gray-700 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            +{order.products.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className='font-medium text-lg'>
                      {order.products && order.products.length > 1 
                        ? `${firstProduct.name} + ${order.products.length - 1} more item${order.products.length > 2 ? 's' : ''}`
                        : firstProduct.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {totalProductCount} item{totalProductCount !== 1 ? 's' : ''} · {DisplayPriceInRupees(order.totalAmt)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => toggleOrderDetails(order._id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Products list */}
                    {order.products && order.products.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                        <div className="space-y-3">
                          {order.products.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                              <div className="w-12 h-12 flex-shrink-0">
                                <img 
                                  src={product.product_details?.image?.[0] || '/placeholder-image.jpg'} 
                                  alt={product.product_details?.name || 'Product'} 
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{product.product_details?.name || 'Product'}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                                  <span>Qty: {product.quantity || 1}</span>
                                  <span>{DisplayPriceInRupees(product.price || 0)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
                        <div className="text-sm space-y-1">
                          <p>Method: <span className="font-medium">{order.payment_status || "Not specified"}</span></p>
                          {order.paymentId && <p>Payment ID: <span className="font-medium">{order.paymentId}</span></p>}
                          <p>Subtotal: <span className="font-medium">{DisplayPriceInRupees(order.subTotalAmt || 0)}</span></p>
                          <p>Total: <span className="font-medium">{DisplayPriceInRupees(order.totalAmt || 0)}</span></p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Delivery Information</h4>
                        <div className="text-sm">
                          {order.delivery_address ? (
                            <div className="space-y-1">
                              <p className="font-medium">{typeof order.delivery_address === 'object' && order.delivery_address.name ? order.delivery_address.name : 'Contact Person'}</p>
                              <p>{typeof order.delivery_address === 'object' && order.delivery_address.address_line ? order.delivery_address.address_line : ''}</p>
                              <p>{typeof order.delivery_address === 'object' ? 
                                `${order.delivery_address.city || ''}, ${order.delivery_address.state || ''} ${order.delivery_address.pincode || ''}` : 
                                ''}
                              </p>
                              <p>{typeof order.delivery_address === 'object' && order.delivery_address.country ? order.delivery_address.country : ''}</p>
                              <p className="mt-1">{typeof order.delivery_address === 'object' && order.delivery_address.mobile ? order.delivery_address.mobile : ''}</p>
                            </div>
                          ) : (
                            <p>No address information available</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                      <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Contact Support
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .loader-lg {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          width: 2em;
          height: 2em;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% {transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default MyOrders;

