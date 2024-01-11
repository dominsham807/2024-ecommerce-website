import { Link } from "react-router-dom"
import { FaTrash } from "react-icons/fa";
import { CartItem } from "../types/types";
import { server } from "../redux/store";

type CartItemProps = {
    cartItem: CartItem
    incrementHandler: (cartItem: CartItem) => void
    decrementHandler: (cartItem: CartItem) => void 
    removeHandler: (id: string) => void     
}

const CartItemCard = ({ 
    cartItem,
    incrementHandler,
    decrementHandler,
    removeHandler
}: CartItemProps) => {
    const {photo, category, productId, name, price, quantity } = cartItem

    return (
        <div className="cart-item">
            <img src={`${server}/${photo}`} alt={name} />
            <article>
                <Link to={`/products/${productId}`}>{name}</Link>
                <span>HK${price}</span>
                <p className="cart-category">{category.toUpperCase()}</p>
            </article>
            <div>
                <button onClick={() => decrementHandler(cartItem)}>-</button>
                <p>{quantity}</p>
                <button onClick={() => incrementHandler(cartItem)}>+</button>
            </div>
            <button onClick={() => removeHandler(productId)}>
                <FaTrash />
            </button>
        </div>
    )
}

export default CartItemCard