import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from './Navbar'
import {useUserData} from './UserContext'

const Login = () => {

  const navigate = useNavigate()

  const {login} = useUserData()   // this line takes the login value from the object we privided in UserProvider in the DataContext file

  const [isClicked, setIsClicked] = useState(false)

  const [loginData, setLoginData] = useState(
    {
      validator:"",
      password:"",
    }
  )

  const handleChange = (e)=>{
    setLoginData({...loginData, [e.target.name]:e.target.value})
  }

  const handleKeyDown = (e)=>{
    if(e.key === 'Enter'){
      handleSubmit()
    }
  }

  const handleSubmit = async(e)=>{

    e.preventDefault()
    console.log(loginData)

    setIsClicked(true)

    try{

      const response = await axios.post('/api/v1/users/login', loginData)
      // console.log(response)
      toast.success(response.data.message)

      login(response.data.data.user)  // here it takes the login var as a function and pass the user info in the param
      
      setIsClicked(false)

      setTimeout(()=>navigate("/home"),3000)

    }catch(error){
      
      console.error("Unable to login the user !!", error.response?.data?.message || error.message)
      
      setIsClicked(false)
      toast.error(error.response?.data?.message || error.message)
    }

  }

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Sign-In now!</h1>
            <p className="py-6">Welcome back! Enter your credentials to access your account.</p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <label className="label">Email or Username</label>
                <input onChange={handleChange} type="text" name="validator" className="input" placeholder="Email or Username" />
                <label className="label">Password</label>
                <input onChange={handleChange} onKeyDown={handleKeyDown} type="password" name="password" className="input" placeholder="Password" />
                <div><a className="link link-hover">Forgot password?</a></div>
                <button onClick={handleSubmit} className="btn btn-neutral mt-4">{isClicked ? <span className="loading loading-spinner loading-sm"></span>: "Sign-in"}</button>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
