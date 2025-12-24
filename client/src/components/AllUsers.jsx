import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AllUsers() {

  const navigate = useNavigate()

  const [allUsers, setAllUsers] = useState([])
  useEffect(() => {

    const fetchUsers = async () => {

      try {
        const response = await axios.get(`/api/v1/profile/all-users`)
        setAllUsers(response.data.data)
        console.log("ALL USERS: ", allUsers)
        console.log("DATA: ", response.data.data)

      } catch (error) {
        console.error("See this err =>", error)
      }
    }

    fetchUsers()
  }, [])
  return (
    <div>
      {allUsers ? allUsers.map((user, index) => (
        <div className='flex justify-center items-center'>
          <div key={index} onClick={()=>navigate(`/home/profile/${user.username}`)} className="flex cursor-pointer w-98 items-center gap-6 h-28 rounded-3xl ">
            <div className="avatar">
              <div className="w-20 rounded-full">
                <img src={user.avatar} />
              </div>
            </div>
            <div className="">
              <h2 className="font-extrabold">{user.username}</h2>
              <p>{user.fullName}</p>
            </div>
          </div>
        </div>
      ))
    :
    <div className='flex justify-center items-center'>
          <div className="flex cursor-pointer w-98 items-center gap-6 h-28 rounded-3xl ">
            <div className=" skeleton avatar">
              <div className="skeleton w-20 rounded-full">
                <img className='skeleton' src={user.avatar} />
              </div>
            </div>
            <div className="">
              <h2 className="skeleton font-extrabold">{user.username}</h2>
              <p className='skeleton'>{user.fullName}</p>
            </div>
          </div>
        </div>}
    </div>
  )
}

export default AllUsers
