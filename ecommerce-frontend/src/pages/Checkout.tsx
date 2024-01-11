import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { NewOrderRequest } from "../types/api-types";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY)

const CheckOutForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const dispatch = useDispatch() 

    const { user } = useSelector((state: RootState) => state.userReducer)
    console.log(user)

    const {
        shippingInfo,
        cartItems,
        subtotal,
        tax, 
        discount,
        shippingCharges,
        total 
    } = useSelector((state: RootState) => state.cartReducer)

    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const [newOrder] = useNewOrderMutation()

    console.log(shippingInfo)
    console.log(cartItems)

    const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      setIsProcessing(true)

      const orderData: NewOrderRequest = {
        shippingInfo,
        orderItems: cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
        user: user?._id!
      }
      console.log(orderData) 
      
    }
    
    return (
        <div className="checkout-container">
            <form >
                <PaymentElement />
                <button type="submit">
                    Pay
                </button>
            </form>
        </div>
    )
}


const Checkout = () => {
    const location = useLocation();
  
    const clientSecret: string | undefined = location.state;
  
    // if (!clientSecret) return <Navigate to={"/shipping"} />;
  
    return (
      <Elements
        options={{
          clientSecret,
        }}
        stripe={stripePromise}
      >
        <CheckOutForm />
      </Elements>
    );
  };
  
export default Checkout