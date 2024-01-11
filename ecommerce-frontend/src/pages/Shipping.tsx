import React, { ChangeEvent, useState, FormEvent, useEffect } from 'react'
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, server } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { resetCart, saveShippingInfo } from '../redux/reducer/cartReducer';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNewOrderMutation } from '../redux/api/orderAPI';
import { NewOrderRequest } from '../types/api-types';
import { responseToast } from '../utils/features';

const Shipping = () => {
    const { user } = useSelector((state: RootState) => state.userReducer)
    const {
        // shippingInfo,
        cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total
    } = useSelector((state: RootState) => state.cartReducer)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    console.log(total)
    console.log(cartItems)

    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: ""
    })

    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const [newOrder] = useNewOrderMutation()

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo((prev) => ({...prev, [e.target.name]: e.target.value }))
    }

    const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch(saveShippingInfo(shippingInfo))
        setIsProcessing(true)

        const orderData: NewOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subtotal,
            tax,
            discount,
            shippingCharges,
            total,
            user: user?._id!,
        };

        try{
            const res = await newOrder(orderData)
            responseToast(res, navigate, "/orders")
            dispatch(resetCart())
        } catch(error){
            setIsProcessing(false);
            console.log(error);
            toast.error("Something went wrong");
        }
        setIsProcessing(false);
    }

    useEffect(() => {
        if(cartItems.length <= 0){
            return navigate("/cart")
        }
    }, [cartItems])

    return (
        <div className='shipping'>
            <button className="back-btn" onClick={() => navigate("/cart")}>
                <BiArrowBack />
            </button>

            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>

                <input type="text" placeholder='Address' name='address'
                value={shippingInfo.address} onChange={changeHandler} required/>

                <input type="text" placeholder='City' name='city'
                value={shippingInfo.city} onChange={changeHandler} required/>

                <input type="text" placeholder='State' name='state'
                value={shippingInfo.state} onChange={changeHandler} required/>

                <select name='country' value={shippingInfo.country} onChange={changeHandler} required>
                    <option value="">Choose country</option>
                    <option value="HKSAR">HKSAR</option>
                    <option value="China">China</option>
                    <option value="Japan">Japan</option>
                </select>

                <input type="number" placeholder='Pin Code' name='pinCode'
                value={shippingInfo.pinCode} onChange={changeHandler} required/>

                <button type='submit' disabled={isProcessing && true}>
                    {isProcessing ? "Processing..." : "Pay Now"}
                </button>
            </form>
        </div>
    )
}

export default Shipping