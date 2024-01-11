import { useSelector } from "react-redux"
import { RootState, server } from "../redux/store"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useOrderDetailsQuery } from "../redux/api/orderAPI"
import { FaTrash } from "react-icons/fa"
import { Order, OrderItem } from "../types/types"
import { Skeleton } from "../components/Loader"

const defaultData: Order = {
    shippingInfo: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
    status: "",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems: [],
    user: { name: "", _id: "" },
    _id: "",
};

const OrderDetails = () => {
    const { user } = useSelector((state: RootState) => state.userReducer)

    const params = useParams()
    const navigate = useNavigate()

    const { isLoading, data, isError } = useOrderDetailsQuery(params.id!)

    console.log(data?.order)

    const {
        shippingInfo: { address, city, state, country, pinCode },
        orderItems,
        user: { name },
        status,
        tax,
        subtotal,
        total,
        discount,
        shippingCharges
    } = data?.order || defaultData
 
    console.log(orderItems)

    return (
        <div className="order-details">
            <section style={{ padding: "2rem" }}>
                {isLoading ? (
                    <Skeleton length={30} />
                ) : (
                    <>
                    <h2>Order: { params.id }</h2>
                    {orderItems.map((item) => (
                        <ProductCard key={item._id} name={item.name} category={item.category}
                        photo={`${server}/${item.photo}`} productId={item.productId} 
                        _id={item._id} quantity={item.quantity} price={item.price} />
                    ))}
                    <Link to={'/orders'} className="back-btn">Back to Your Orders</Link>
                    </>
                )}

            </section>
            <article className="shipping-info-card">
                <h1>Order Info</h1>
                <h5>User Info</h5>
                <p>Name: {name}</p>
                <p>
                    Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
                </p>
                <h5>Amount Info</h5>
                <p>Subtotal: {subtotal}</p>
                <p>Shipping Charges: {shippingCharges}</p>
                <p>Tax: {tax}</p>
                <p>Discount: {discount}</p>
                <p>Total: {total}</p>

                <h5>Status Info</h5>
                <p>
                    Status:{" "}
                    <span
                        className={
                        status === "Delivered"
                            ? "purple"
                            : status === "Shipped"
                            ? "green"
                            : "red"
                        }
                    >
                        {status}
                    </span>
                </p>
            </article>
        </div>
    )
}

const ProductCard = ({
    name,
    category,
    photo,
    price,
    quantity,
    productId,
  }: OrderItem) => (
    <div className="transaction-product-card">
        <img src={photo} alt={name} />
        <div className="product-information">
            <Link to={`/product/${productId}`} className="product-name">{name}</Link>
            <p>{category.toUpperCase()}</p>
        </div> 
        <span>
            HK${price} x {quantity} = HK${price * quantity}
        </span>

    </div>
);

export default OrderDetails