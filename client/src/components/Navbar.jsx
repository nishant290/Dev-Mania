import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeChanger from './themeChanger';
import { useUserData } from './UserContext'
import axios from 'axios';


function Navbar() {

  const navigate = useNavigate()

  const { user } = useUserData() // here we take the user detail

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li><a onClick={() => {
                navigate('/')
                console.log(user)
              }
              }>Homepage</a></li>
              <li><a>Portfolio</a></li>
              <li><a>About</a></li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">

          <a className="btn btn-ghost text-xl" onClick={() => navigate('/home')}>Dev-Mania</a>
        </div>
        <div className="navbar-end mr-6">
          
          {user ?
            (
              <div className="tooltip tooltip-bottom mx-5" data-tip="Profile">
                <div className="avatar cursor-pointer">
                  <div className="w-9 rounded-full">
                    <img
                      onClick={() => { navigate(`/home/profile/${user.username}`) }}
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )
            : (
              <button onClick={() => { navigate('/login') }} className="btn btn-ghost ">Login</button>
            )
          }
          <div className="themeChanger ">
            <ThemeChanger />
          </div>
        </div>
      </div>
    </div >
  )
}

export default Navbar
