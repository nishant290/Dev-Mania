import React from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div>
      <div className="hero bg-base-800 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold">Dev-Mania</h1>
            <p className="py-6">
              This is a social Network for the developers !!
            </p>
            <Link to='/login'>
              <button className="btn btn-soft mx-5 ml-auto">Sign-In</button>
            </Link>
            <Link to='/signup'>
              <button className="btn btn-outline">Sign-Up</button>
            </Link>
            <Link to='/home'>
              <button className="btn my-5 btn-wide btn-soft">Get started &gt;</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
