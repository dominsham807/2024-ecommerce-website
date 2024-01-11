import { FaPlus } from "react-icons/fa"
import { server } from "../redux/store"
import { CartItem } from "../types/types"

type ProductProps = {
    productId: string
    photo: string
    name: string
    category: string 
    price: number
    stock: number
    handler: (cartItem: CartItem) => string | undefined
}

const ProductCard = ({
    productId,
    photo,
    name,
    category,
    price,
    stock,
    handler
}: ProductProps) => {
    return (
        <div className="product-card">
            <h3 className="category">{category.toUpperCase()}</h3>
            <img src={`${server}/${photo}`} alt={name} />
            <p>{name}</p>
            <span>HK$ {price}</span>
            <div>
                <button onClick={() => handler({
                    productId,
                    price,
                    name,
                    category,
                    photo,
                    stock,
                    quantity: 1
                })}>
                    <FaPlus />
                </button>

            </div>
        </div>
    )
}

export default ProductCard