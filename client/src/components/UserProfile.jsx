import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserData } from './UserContext'
import { useNavigate } from 'react-router-dom'

function UserProfile() {

  const { username } = useParams()

  const [userProfile, setUserProfile] = useState({})
  const [reload, setReload] = useState(false)

  const { logout } = useUserData()
  const { navigate } = useNavigate()

  useEffect(() => {

    const fetchUsername = async () => {

      console.log("FINAL USER: ",)
      console.log("FINAL USERNAME: ", username)

      try {
        const response = await axios.get(`/api/v1/profile/user/${username}`)
        console.log("RESPONSE: ", response)

        setUserProfile(response.data.data)
        console.log("USERPROFILE: ", userProfile)
      } catch (error) {
        console.error("Failed to use the USERNAME !!", error)
      }
    }
    fetchUsername()
  }, [username, reload])

  const handleFollow = async (e) => {
    e.preventDefault()
    try {
      await axios.get(`/api/v1/profile/user/follow/${username}`)
      setReload(prev => !prev)
    } catch (error) {
      console.error("Failed to follow", error)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/home')

  }


  return (

    <div className='flex flex-col sm:justify-center items-center p-10 ' >
      <div className='flex items-center justify-between flex-col min-w-1/2 sm:flex-row'>
        <div className="right flex items-center gap-6">
          <div className="avatar">
            <div className="w-20 rounded-full">
              <img src={userProfile.avatar} />
            </div>
          </div>
          <div className="username">
            <h1>{userProfile.username}</h1>
            <h1>{userProfile.fullName}</h1>
          </div>
        </div>
        <div className="follow mx-5 ">
          {userProfile.isOwnProfile
            ? <button className=" btn btn-wide btn-primary sm:  btn-rounded">Edit Profile</button>
            : userProfile.isFollowing ?
              (<button className=" btn btn-wide btn-neutral sm:  btn-rounded">Following</button>)
              : (<button onClick={handleFollow} className=" btn btn-wide btn-primary sm:  btn-rounded">Follow</button>)
          }
        </div>

      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
          </div>
          <div className="stat-title">Followers</div>
          <div className="stat-value text-primary">{userProfile.followersCount}</div>
          <div className="stat-desc">Accounts follows you.</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
          </div>
          <div className="stat-title">Following</div>
          <div className="stat-value text-secondary">{userProfile.followingCount}</div>
          <div className="stat-desc">Accounts you follow.</div>
        </div>
      </div>

      <div className='absolute bottom-16'>
        
          <label className='btn btn-ghost' htmlFor="my_modal_7" style={{ color: "var(--label-color)" }}>
            Logout
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
            </svg>
          </label>



        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm logout </h3>
            <p className="py-4">Are you sure you want to logout?</p>
            <div className="model-action">
              <label className="btn mr-4" htmlFor="my_modal_7">Close</label>
              <label onClick={handleLogout} className="btn btn-primary border-red-600 bg-red-600" htmlFor="my_modal_7">Logout</label>
            </div>
          </div>
          <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
        </div>

      </div>
    </div>

  )
}

export default UserProfile
