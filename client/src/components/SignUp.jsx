import React from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {useUserData} from './UserContext'


const SignUp = () => {

    const [formData, setFormData] = useState({
        avatar: null,
        fullName: "",
        username: "",
        email: "",
        password: ""
    })
 
    const [isClicked,setIsClicked] = useState(false)

    const navigate = useNavigate()

    const {login} = useUserData()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.name === "avatar" ? e.target?.files[0] : e.target.value })
    }

    const data = new FormData()
    data.append("avatar", formData.avatar)
    data.append("fullName", formData.fullName)
    data.append("username", formData.username)
    data.append("email", formData.email)
    data.append("password", formData.password)

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)

        setIsClicked(true)

        try {
            const response = await axios.post('/api/v1/users/register', data)

            const userData = response.data.data.user
            console.log("User data being saved:", userData)
        
        if (userData && userData.username && userData.avatar) {
            login(userData)
            toast.success(response.data.message)
            
            await new Promise(resolve => setTimeout(resolve, 100))
            navigate("/home")
        } else {
            console.error("Incomplete user data:", userData)
            toast.error("Registration successful but user data incomplete")
        }
        
        setIsClicked(false)

        } catch (error) {
            console.log(error)
            console.error("Something Went Wrong !!!", error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message);
            setIsClicked(false)
        }
    }

    return (
        <div>
            <div>

                <div className="hero bg-base-250 min-h-screen">
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold">Create your account!
                            </h1>
                            <p className="py-6">Sign up now to connect, explore, and enjoy a personalized experience made for you.</p>
                        </div>
                        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                            <div className="card-body">
                                <fieldset className="fieldset">
                                    <div className="avatar justify-center">
                                        <div className="w-24 ml-9 rounded-full">
                                            <input onChange={handleChange} type="file" accept='image/*' id="image-uploader" className="hidden" name="avatar" alt="Avatar" />
                                            {formData.avatar !== null && <img src={URL.createObjectURL(formData.avatar)} alt="Avatar Preview" />}
                                            {formData.avatar === null && <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />}
                                        </div>
                                        <label htmlFor="image-uploader" style={{ color: "var(--label-color)" }} className='cursor-pointer h-8 w-8 mt-14 rounded-full hover:bg-gray-300 focus:outline-nonex flex items-center justify-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                            </svg>
                                        </label>
                                    </div>
                                    <label className="label">Name</label>
                                    <input onChange={handleChange} type="text" name="fullName" className="input" placeholder="Name" />
                                    <label className="label">Username</label>
                                    <input onChange={handleChange} type="text" name="username" className="input" placeholder="Username" />
                                    <label className="label">Email</label>
                                    <input onChange={handleChange} type="email" name="email" className="input" placeholder="Email" />
                                    <label className="label">Password</label>
                                    <input onChange={handleChange} type="password" name="password" className="input" placeholder="Password" />
                                    <button onClick={handleSubmit} className="btn btn-neutral mt-4">{isClicked ? <span className="loading loading-spinner loading-sm"></span>: "Create"}</button>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
