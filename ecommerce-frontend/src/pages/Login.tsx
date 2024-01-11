import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import toast from "react-hot-toast"
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { getUser, useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { MessageResponse } from "../types/api-types";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../redux/reducer/userReducer";

const Login = () => {
    const dispatch = useDispatch()
    const [gender, setGender] = useState("")
    const [date, setDate] = useState("")
    console.log(date)

    const [login] = useLoginMutation()

    const loginHandler = async() => {
        try{
            const provider = new GoogleAuthProvider()
            const { user } = await signInWithPopup(auth, provider)
            console.log(user.displayName, user.email, user.photoURL, gender, date, user.uid)

            const res = await login({
                name: user.displayName!,
                email: user.email!,
                photo: user.photoURL!,
                gender,
                role: "user",
                dob: date,
                _id: user.uid, 
            })
            console.log(res)
            console.log("data" in res)

            if("data" in res){
                toast.success(res.data.message)
                const data = await getUser(user.uid)
                dispatch(userExist(data?.user!))
            } else{
                const error = res.error as FetchBaseQueryError
                const message = (error.data as MessageResponse).message
                console.log(error)
                toast.error(message)
                dispatch(userNotExist())
            }
            console.log(user)
        } catch(error){
            toast.error("Sign in failed")
        }
    }
    
    return (
        <div className="login">
            <main>
                <h1 className="heading">Login</h1>
                <div>
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option> 
                    </select>
                </div>
                <div>
                    <label>Date of Birth</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                    <p>Already signed in once?</p>
                    <button onClick={loginHandler}>
                        <FcGoogle /> <span>Sign in with Google</span>
                    </button>
                </div>
            </main>
        </div>
    )
}

export default Login