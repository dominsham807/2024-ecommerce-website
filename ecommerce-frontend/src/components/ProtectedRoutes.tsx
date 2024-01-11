import { ReactElement } from "react"
import { Navigate, Outlet } from "react-router-dom"

interface Props {
    isAuthenticated: boolean,
    children?: ReactElement,
    adminOnly?: boolean,
    admin?: boolean,
    redirect?: string
}

const ProtectedRoutes = ({
    isAuthenticated,
    children, 
    adminOnly,
    admin,
    redirect = "/"
}: Props) => {
    console.log(isAuthenticated)
    if(!isAuthenticated) return <Navigate to={redirect} />

    if(adminOnly && !admin) return <Navigate to={redirect} />

    return children ? children : <Outlet />
}

export default ProtectedRoutes