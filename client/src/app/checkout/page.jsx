// src/app/checkout/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../providers/GlobalProvider";
import { DisplayPriceInRupees } from "../../utils/DisplayPriceInRupees";
import { useSelector, useDispatch } from "react-redux";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { persistReceiptSnapshot } from "../../utils/persistReceiptSnapshot";

const buildSuccessUrl = (orderId, token, text = "Order") => {
  let url = `/success?text=${encodeURIComponent(text)}`;
  if (orderId) {
    url += `&orderId=${encodeURIComponent(orderId)}`;
  }
  if (token) {
    url += `&token=${encodeURIComponent(token)}`;
  }
  return url;
};

const CheckoutPage = () => {
  const {
    notDiscountTotalPrice,
    totalPrice,
    totalQty,
    fetchCartItem,
    fetchOrder,
    fetchAddress,
  } = useGlobalContext();
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isAddressLoaded, setIsAddressLoaded] = useState(false);
  const user = useSelector((state) => state?.user);
  const isAuthenticated = !!user?.email;

  const [guestAddress, setGuestAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [loadingBtn, setLoadingBtn] = useState({
    cod: false,
    online: false,
    mtn: false,
    orange: false,
  });

  const selectedAddress = isAuthenticated
    ? addressList[selectAddress] || {}
    : guestAddress;

  useEffect(() => {
    if (!isAuthenticated) {
      const savedGuestAddress =
        typeof window !== "undefined"
          ? localStorage.getItem("guestAddress")
          : null;
      if (savedGuestAddress) {
        try {
          setGuestAddress(JSON.parse(savedGuestAddress));
        } catch (error) {
          console.error("Error parsing guest address:", error);
        }
      }
      setIsAddressLoaded(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!isAuthenticated) return;
      try {
        if (fetchAddress) {
          await fetchAddress();
        } else {
          const response = await Axios({
            ...SummaryApi.getAddress,
          });
          if (response.data.success) {
            dispatch({
              type: "SET_ADDRESS_LIST",
              payload: response.data.addresses,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);
        toast.error("Failed to load your saved addresses");
      } finally {
        setIsAddressLoaded(true);
      }
    };

    loadAddresses();
  }, [dispatch, fetchAddress, isAuthenticated]);

  useEffect(() => {
    if (!isAddressLoaded) return;

    if (isAuthenticated) {
      setShowAddressForm(addressList.length === 0);
    } else {
      setShowAddressForm(!guestAddress);
    }
  }, [addressList, guestAddress, isAddressLoaded, isAuthenticated]);

  useEffect(() => {
    if (
      isAuthenticated &&
      addressList.length > 0 &&
      isAddressLoaded &&
      selectAddress === 0
    ) {
      const firstValidIndex = addressList.findIndex((addr) => addr.status);
      if (firstValidIndex >= 0) {
        setSelectAddress(firstValidIndex);
      }
    }
  }, [addressList, isAddressLoaded, isAuthenticated, selectAddress]);

  const requireAddress = () => {
    if (isAuthenticated) {
      if (!addressList.length) {
        toast.error("Please add an address before proceeding with your order.", {
          position: "top-center",
        });
        setShowAddressForm(true);
        return false;
      }
      if (!selectedAddress?._id) {
        toast.error("Select your address before placing your order.", {
          position: "top-center",
        });
        return false;
      }
    } else if (!guestAddress) {
      toast.error("Please add your delivery information before proceeding.", {
        position: "top-center",
      });
      setShowAddressForm(true);
      return false;
    }
    return true;
  };

  const handleCashOnDelivery = async () => {
    if (!requireAddress()) return;

    try {
      setLoadingBtn((prev) => ({ ...prev, cod: true }));

      if (isAuthenticated) {
        const response = await Axios({
          ...SummaryApi.CashOnDeliveryOrder,
          data: {
            list_items: cartItemsList,
            quantity: totalQty,
            addressId: selectedAddress?._id,
            subTotalAmt: totalPrice,
            totalAmt: totalPrice,
            email: selectedAddress?.email || selectedAddress?.customer_email,
            phone: selectedAddress?.mobile,
          },
        });

        const { data: responseData } = response;

        if (responseData.success && responseData.data) {
          const orderPayload = responseData.data;
          const orderId = orderPayload.orderId;
          const integrityToken = orderPayload.integrityToken ?? "";

          persistReceiptSnapshot(orderPayload, { orderId, integrityToken });

          toast.success(responseData.message || "Order placed successfully");

          if (fetchCartItem) fetchCartItem();
          if (fetchOrder) fetchOrder();

          const successUrl = buildSuccessUrl(orderId, integrityToken, "Order");
          router.push(successUrl);
        }
      } else {
        const response = await Axios({
          url: "/api/order/guest-cod",
          method: "POST",
          data: {
            list_items: cartItemsList,
            quantity: totalQty,
            subTotalAmt: totalPrice,
            totalAmt: totalPrice,
            isGuestOrder: true,
            ...guestAddress,
          },
        });

        const { data: responseData } = response;

        if (responseData.success && responseData.data) {
          const orderPayload = responseData.data;
          const orderId = responseData.orderId ?? orderPayload.orderId;
          const integrityToken =
            orderPayload.integrityToken ??
            responseData.integrityToken ??
            "";

          persistReceiptSnapshot(orderPayload, { orderId, integrityToken });

          if (typeof window !== "undefined") {
            localStorage.removeItem("guestCart");
            localStorage.removeItem("guest_cart");
          }

          toast.success(responseData.message || "Order placed successfully");

          if (fetchCartItem) fetchCartItem();

          const successUrl = buildSuccessUrl(orderId, integrityToken, "Order");
          router.push(successUrl);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoadingBtn((prev) => ({ ...prev, cod: false }));
    }
  };

  const handleOnlinePayment = async () => {
    if (!requireAddress()) return;

    try {
      setLoadingBtn((prev) => ({ ...prev, online: true }));
      const loadingToast = toast.loading("Loading payment gateway...");

      const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
      const stripe = await loadStripe(stripePublicKey);

      const endpoint = isAuthenticated
        ? SummaryApi.payment_url
        : { url: "/api/payment/guest-stripe", method: "POST" };

      const paymentData = isAuthenticated
        ? {
            list_items: cartItemsList,
            addressId: selectedAddress?._id,
            subTotalAmt: totalPrice,
            totalAmt: totalPrice,
            email:
              selectedAddress?.email ||
              selectedAddress?.customer_email ||
              "",
            phone: selectedAddress?.mobile,
          }
        : {
            list_items: cartItemsList,
            subTotalAmt: totalPrice,
            totalAmt: totalPrice,
            isGuestOrder: true,
            ...guestAddress,
          };

      const response = await Axios({
        ...endpoint,
        data: paymentData,
      });

      toast.dismiss(loadingToast);

      const { data: responseData } = response;
      const redirectResult = await stripe.redirectToCheckout({
        sessionId: responseData.id,
      });

      if (redirectResult.error) {
        toast.error(redirectResult.error.message || "Unable to redirect");
      }

      if (fetchCartItem) fetchCartItem();
      if (fetchOrder) fetchOrder();
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    } finally {
      setLoadingBtn((prev) => ({ ...prev, online: false }));
    }
  };

  const handleMtnPayment = async () => {
    if (!requireAddress()) return;

    try {
      setLoadingBtn((prev) => ({ ...prev, mtn: true }));
      const loadingToast = toast.loading("Redirecting to MTN MoMo...");

      const endpoint = isAuthenticated ? "/payments/mtn" : "/payments/guest-mtn";

      const response = await Axios.post(endpoint, {
        amount: totalPrice,
        phone: selectedAddress?.mobile || guestAddress?.mobile,
        order_id: `ORDER_${Date.now()}`,
        email:
          selectedAddress?.email ||
          selectedAddress?.customer_email ||
          guestAddress?.customer_email,
        name:
          selectedAddress?.name ||
          guestAddress?.name ||
          user?.name ||
          "Customer",
        ...(isAuthenticated ? {} : { isGuestOrder: true, ...guestAddress }),
      });

      toast.dismiss(loadingToast);

      const { payment_url: paymentUrl } = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Failed to initiate MTN payment");
      }
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    } finally {
      setLoadingBtn((prev) => ({ ...prev, mtn: false }));
    }
  };

  const handleOrangePayment = async () => {
    if (!requireAddress()) return;

    try {
      setLoadingBtn((prev) => ({ ...prev, orange: true }));
      const loadingToast = toast.loading("Redirecting to Orange Money...");

      const endpoint = isAuthenticated
        ? "/payments/orange"
        : "/payments/guest-orange";

      const response = await Axios.post(endpoint, {
        amount: totalPrice,
        phone: selectedAddress?.mobile || guestAddress?.mobile,
        order_id: `ORDER_${Date.now()}`,
        email:
          selectedAddress?.email ||
          selectedAddress?.customer_email ||
          guestAddress?.customer_email,
        name:
          selectedAddress?.name ||
          guestAddress?.name ||
          user?.name ||
          "Customer",
        ...(isAuthenticated ? {} : { isGuestOrder: true, ...guestAddress }),
      });

      toast.dismiss(loadingToast);

      const { payment_url: paymentUrl } = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Failed to initiate Orange payment");
      }
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    } finally {
      setLoadingBtn((prev) => ({ ...prev, orange: false }));
    }
  };

  const onSubmitAddress = async (data) => {
    try {
      if (isAuthenticated) {
        const loadingToast = toast.loading("Saving your address...");

        const response = await Axios({
          ...SummaryApi.createAddress,
          data: {
            name: data.name,
            customer_email: data.email,
            address_line: data.addressline,
            city: data.city,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            mobile: data.mobile,
          },
        });

        toast.dismiss(loadingToast);

        const { data: responseData } = response;
        if (responseData.success) {
          toast.success(responseData.message);
          reset();
          if (fetchAddress) {
            await fetchAddress();
          } else {
            const addressResponse = await Axios({
              ...SummaryApi.getAddress,
            });
            if (addressResponse.data.success) {
              dispatch({
                type: "SET_ADDRESS_LIST",
                payload: addressResponse.data.addresses,
              });
            }
          }
          setShowAddressForm(false);
        }
      } else {
        const guestAddressData = {
          name: data.name,
          customer_email: data.email,
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
          status: true,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "guestAddress",
            JSON.stringify(guestAddressData)
          );
        }
        setGuestAddress(guestAddressData);
        toast.success("Delivery information saved");
        reset();
        setShowAddressForm(false);
      }
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    }
  };

  const renderPaymentButtons = () => {
    const buttonClass = (bgColor, hoverColor) => `
      py-2.5 px-4 ${bgColor} ${hoverColor} rounded-md text-white font-semibold 
      flex items-center justify-center transition-colors
      cursor-pointer
    `;
    return (
      <div className="w-full flex flex-col gap-3 mt-6">
        <button
          className={buttonClass("bg-yellow-500", "hover:bg-green-500")}
          onClick={handleMtnPayment}
          type="button"
        >
          {loadingBtn.mtn ? (
            <span className="flex items-center">
              <span className="loader mr-2"></span>Processing...
            </span>
          ) : (
            "MTN Mobile Money"
          )}
        </button>

        <button
          className={`py-2.5 px-4 border-2 border-pink-400 font-semibold 
            text-pink-500 hover:bg-pink-400 hover:text-white rounded-md 
            flex items-center justify-center transition-colors cursor-pointer
          `}
          onClick={handleCashOnDelivery}
          type="button"
        >
          {loadingBtn.cod ? (
            <span className="flex items-center">
              <span className="loader mr-2"></span>Processing...
            </span>
          ) : (
            "Cash on Delivery"
          )}
        </button>
      </div>
    );
  };

  const renderFormField = (id, label, type = "text", required = true) => (
    <div className="grid gap-1">
      <label htmlFor={id} className="font-medium text-sm">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        className={`border ${
          errors[id] ? "border-red-500 bg-red-50" : "bg-blue-50"
        } p-2 rounded border-gray-400 focus:outline-none focus:ring-2`}
        {...register(id, { required: required ? `${label} is required` : false })}
      />
      {errors[id] && (
        <p className="text-red-500 text-xs mt-1">{errors[id].message}</p>
      )}
    </div>
  );

  const renderGuestLoginButton = () => {
    if (isAuthenticated) return null;
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-blue-500">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-blue-500">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Guest Checkout</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                You're checking out as a guest. Want to save your information for
                next time?
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => router.push("/login?from=/checkout")}
                className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded hover:bg-blue-200"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register?from=/checkout")}
                className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-blue-50 min-h-screen py-4">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row w-full gap-6 justify-between">
        <div className="w-full lg:w-3/5">
          {renderGuestLoginButton()}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {isAuthenticated
                  ? "Your Delivery Address"
                  : "Delivery Information"}
              </h3>
              {isAddressLoaded &&
                ((isAuthenticated && addressList.length > 0) ||
                  (!isAuthenticated && guestAddress)) &&
                !showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center gap-1 bg-white py-1 px-3 rounded-full shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {isAuthenticated ? "Add New Address" : "Update Information"}
                  </button>
                )}
              {showAddressForm &&
                ((isAuthenticated && addressList.length > 0) ||
                  (!isAuthenticated && guestAddress)) && (
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="text-pink-500 hover:text-pink-700 text-sm font-medium flex items-center gap-1 bg-white py-1 px-3 rounded-full shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Hide Form
                  </button>
                )}
            </div>

            {!isAddressLoaded && (
              <div className="bg-white p-8 rounded-lg shadow-md flex justify-center items-center">
                <div className="loader-lg mr-3"></div>
                <p className="text-gray-600">Loading your delivery information...</p>
              </div>
            )}

            {showAddressForm && (
              <div className="bg-white p-5 rounded-lg shadow-md mb-5 transition-all duration-300">
                <div className="flex justify-between items-center gap-4 border-b pb-3 mb-4">
                  <h2 className="font-bold text-lg text-gray-800">
                    {isAuthenticated
                      ? addressList.length === 0
                        ? "Add Your First Address"
                        : "Add New Address"
                      : guestAddress
                      ? "Update Delivery Information"
                      : "Enter Delivery Information"}
                  </h2>
                  {((isAuthenticated && addressList.length > 0) ||
                    (!isAuthenticated && guestAddress)) && (
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <IoClose size={20} />
                    </button>
                  )}
                </div>
                <form className="grid gap-4" onSubmit={handleSubmit(onSubmitAddress)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderFormField("name", "Full Name")}
                    {renderFormField("email", "Email Address", "email")}
                  </div>
                  {renderFormField("addressline", "Address Line/Quarter")}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderFormField("city", "City")}
                    {renderFormField("state", "State/Region")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderFormField("pincode", "Postal Code")}
                    {renderFormField("country", "Country")}
                  </div>
                  {renderFormField("mobile", "Mobile Number")}
                  <button
                    type="submit"
                    className="bg-pink-500 w-full py-3 rounded-md font-bold text-white mt-2 hover:bg-pink-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    SAVE {isAuthenticated ? "ADDRESS" : "INFORMATION"}
                  </button>
                </form>
              </div>
            )}

            {isAddressLoaded &&
              ((isAuthenticated && !addressList.length) ||
                (!isAuthenticated && !guestAddress)) &&
              !showAddressForm && (
                <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 font-semibold flex items-center rounded-lg">
                  <svg
                    className="w-6 h-6 mr-3 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <div>
                    <p>
                      No delivery {isAuthenticated ? "addresses" : "information"} found.
                    </p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-blue-600 underline text-sm mt-1 font-normal"
                    >
                      Click here to{" "}
                      {isAuthenticated
                        ? "add your first address"
                        : "enter your information"}
                    </button>
                  </div>
                </div>
              )}

            {isAuthenticated && isAddressLoaded && addressList.length > 0 && (
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h4 className="font-medium text-sm text-gray-500 mb-3">
                  {addressList.filter((addr) => addr.status).length > 0
                    ? "Select a delivery address"
                    : "No active addresses found"}
                </h4>
                <div className="grid gap-3">
                  {addressList.filter((addr) => addr.status).length === 0 && (
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-md">
                      <p>All your addresses are currently inactive.</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="text-blue-600 underline text-sm mt-1"
                      >
                        Add a new address
                      </button>
                    </div>
                  )}
                  {addressList.map((address, index) => {
                    if (!address.status) return null;
                    return (
                      <label
                        key={address._id || index}
                        htmlFor={`address${index}`}
                        className="cursor-pointer"
                      >
                        <div
                          className={`border rounded-lg p-4 flex gap-3 transition-all duration-200 hover:bg-blue-50 ${
                            selectAddress === index
                              ? "ring-2 ring-pink-400 bg-pink-50"
                              : ""
                          }`}
                        >
                          <div>
                            <input
                              id={`address${index}`}
                              type="radio"
                              value={index}
                              checked={selectAddress === index}
                              onChange={(e) => setSelectAddress(Number(e.target.value))}
                              name="address"
                              disabled={
                                loadingBtn.cod ||
                                loadingBtn.online ||
                                loadingBtn.mtn ||
                                loadingBtn.orange
                              }
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">{address.name}</p>
                            <p className="text-sm text-gray-600">
                              {address.customer_email}
                            </p>
                            <p className="text-sm text-gray-700">
                              {address.address_line}
                            </p>
                            <p className="text-sm text-gray-700">
                              {address.city}, {address.state}
                            </p>
                            <p className="text-sm text-gray-700">
                              {address.country} - {address.pincode}
                            </p>
                            <p className="text-sm font-medium mt-1 text-gray-800">
                              {address.mobile}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {!isAuthenticated &&
              isAddressLoaded &&
              guestAddress &&
              !showAddressForm && (
                <div className="bg-white p-5 rounded-lg shadow-md">
                  <h4 className="font-medium text-sm text-gray-500 mb-3">
                    Your delivery information
                  </h4>
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <p className="font-bold text-gray-800">{guestAddress.name}</p>
                    <p className="text-sm text-gray-600">
                      {guestAddress.customer_email}
                    </p>
                    <p className="text-sm text-gray-700">
                      {guestAddress.address_line}
                    </p>
                    <p className="text-sm text-gray-700">
                      {guestAddress.city}, {guestAddress.state}
                    </p>
                    <p className="text-sm text-gray-700">
                      {guestAddress.country} - {guestAddress.pincode}
                    </p>
                    <p className="text-sm font-medium mt-1 text-gray-800">
                      {guestAddress.mobile}
                    </p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="mt-3 text-blue-600 text-sm hover:underline"
                    >
                      Edit information
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="w-full lg:w-2/5">
          <div className="bg-white rounded-lg shadow-md p-5 sticky top-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Order Summary
            </h3>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-3 text-gray-700">Bill Details</h3>
              <div className="flex gap-4 justify-between py-2 border-b border-gray-100">
                <p className="text-gray-600">
                  Items total ({totalQty} item{totalQty !== 1 ? "s" : ""})
                </p>
                <p className="flex items-center gap-2">
                  {notDiscountTotalPrice !== totalPrice && (
                    <span className="line-through text-neutral-400 text-sm">
                      {DisplayPriceInRupees(notDiscountTotalPrice)}
                    </span>
                  )}
                  <span className="font-medium">
                    {DisplayPriceInRupees(totalPrice)}
                  </span>
                </p>
              </div>
              <div className="flex gap-4 justify-between py-2 border-b border-gray-100">
                <p className="text-gray-600">Delivery Charge</p>
                <p className="flex items-center gap-2 text-green-600 font-medium">
                  Free
                </p>
              </div>
              <div className="font-semibold flex items-center justify-between gap-4 mt-3 pt-3">
                <p className="text-lg text-gray-800">Grand Total</p>
                <p className="text-lg text-pink-600">
                  {DisplayPriceInRupees(totalPrice)}
                </p>
              </div>
            </div>
            {renderPaymentButtons()}
            {(isAuthenticated
              ? !addressList.length || !selectedAddress?._id
              : !guestAddress) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700 flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    You need to{" "}
                    {isAuthenticated
                      ? addressList.length
                        ? "select"
                        : "add"
                      : "provide"}{" "}
                    your delivery information before you can proceed with payment.
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #e11d48;
          border-radius: 50%;
          width: 1em;
          height: 1em;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        .loader-lg {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #e11d48;
          border-radius: 50%;
          width: 2em;
          height: 2em;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default CheckoutPage;