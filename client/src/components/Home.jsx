import { useNavigate } from 'react-router-dom'
import { useUserData } from './UserContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import PostContent from './PostContent'


function Home() {

  const navigate = useNavigate()

  const { user } = useUserData()

  const [allPosts, setAllPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    const fetchPosts = async () => {

      try {

        const response = await axios.get('/api/v1/home')
        console.log("RESPONSE: ", response)


        setAllPosts(response.data.data)
        console.log("ALL POSTS: ", allPosts)

      } catch (error) {
        console.error("Failed to fetch all the posts", error)
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchPosts()

  }, [])

  return (
    <div className="min-h-screen pb-24">
      <div className="cards-container flex flex-col gap-6 mt-6 md:mt-10 justify-center items-center px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <>
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex w-full max-w-2xl flex-col mb-8 md:mb-16 gap-6">
                <div className="skeleton h-48 sm:h-56 md:h-62 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            ))}
          </>
        ) : allPosts.length !== 0 ? (
          allPosts.map((post) => (
            <div
              onClick={() => navigate(`/home/post/${post._id}`)}
              key={post._id}
              className="card cursor-pointer bg-base-100 w-full max-w-2xl shadow-sm">
              {/* <PostContent
                postImage={post.postImage}
                title={post.title}
                content={post.content}
              /> */}
              <figure>
                <img
                  className="w-full h-48 sm:h-64 md:h-80 object-cover"
                  src={post.postImage || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                  alt={post.title} />
              </figure>
              <div className='user-data m-5 flex items-center gap-2'>
                <div className="avatar ">
                  <div className='w-10 rounded-full'>
                    <img src={post.owner?.avatar} />
                  </div>
                </div>
                <div className="user-info">
                  <div className="username font-medium text-sm">
                    {post.owner?.username}
                  </div>
                  <div className="fullname font-light text-sm">
                    {post.owner?.fullName}
                  </div>
                </div>

              </div>
              <div className="card-body gap-4 md:gap-6 p-2 sm:p-2">
                <h2 className="card-title font-bold text-xl sm:text-2xl">
                  {post.title}
                </h2>
                <p className="line-clamp-2 text-sm sm:text-base">{post.content}</p>
                <div className="card-actions justify-start flex-wrap">
                  {post.hashtags?.map((tag, index) => (
                    <div key={index} className="badge badge-outline p-2 text-xs sm:text-sm">{tag}</div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No posts are available :( </p>
        )
        }

      </div>


      {user ?
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
          <label
            style={{ color: "var(--label-color)" }}
            className="tooltip tooltip-left border hover:bg-gray-600 cursor-pointer p-3 sm:p-4 active:scale-95 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
            data-tip="Create post !!"
            onClick={() => navigate('/home/new')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="sm:w-[26px] sm:h-[26px]" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
            </svg>
          </label>
        </div>
        :
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
          <label
            style={{ color: "var(--label-color)" }}
            className="tooltip tooltip-left border hover:bg-gray-600 cursor-pointer p-3 sm:p-4 active:scale-95 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
            data-tip="Create post !!"
            onClick={() => navigate('/login')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="sm:w-[26px] sm:h-[26px]" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
            </svg>
          </label>
        </div>}
    </div>
  )
}

export default Home