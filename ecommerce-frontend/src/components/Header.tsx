import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaSearch, FaSignInAlt, FaSignOutAlt } from "react-icons/fa"
import { User } from "../types/types"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import toast from "react-hot-toast"

interface PropsType {
    user: User | null
}

const Header = ({ user }: PropsType) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    // console.log(user?.photo)
    const navigate = useNavigate()
    
    const logoutHandler = async() => {
        try{
            await signOut(auth)
            toast.success("Signed out successfully")
            setIsOpen(false)
            navigate("/")
        } catch(error){
            toast.error("Sign out failed")
        }
    }

    return (
        <nav className="header">
            <div className="nav-logo">
                2024.com
            </div>
            <div className="nav-routes">
                <Link to={"/"}>Home</Link>  
                <Link to={"/products"}>Products</Link>  
                <Link to={"/"}>Shippings</Link>  
                <Link to={"/cart"}>    
                    Cart
                </Link>
               
            </div>
            <div className="nav-links">
                <Link to={"/search"}>
                    <FaSearch />
                </Link>
                {user?._id ? (
                    <>
                    <img src={user?.photo} onClick={() => setIsOpen((prev) => !prev)} />
                        {/* <FaUser />
                    </button> */}
                    <dialog open={isOpen}>
                        <div>
                            {user.role === "admin" && (
                                <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                                    Admin
                                </Link>
                            )}
                            <Link onClick={() => setIsOpen(false)} to="/orders">
                                Orders
                            </Link>
                            <button onClick={logoutHandler}>
                                <FaSignOutAlt />{" "}Logout
                            </button>
                        </div>
                    </dialog>
                    </>
                ) : (
                    <Link to={"/login"}>
                        <FaSignInAlt />
                    </Link>
                )}
            </div> 
        </nav>
    )
}

export default Header