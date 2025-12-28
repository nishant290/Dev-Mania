import React, { useState, useEffect } from 'react'
import { useUserData } from './UserContext'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function PostContent() {
  const { id } = useParams()
  const { user } = useUserData()
  const navigate = useNavigate()

  const [post, setPost] = useState({})
  const [isLiked, setIsLiked] = useState(JSON.parse(localStorage.getItem("like")) || false)

  useEffect(() => {
    const postData = async () => {
      try {
        const response = await axios.get(`/api/v1/home/post/${id}`)
        console.log("CONTENT RESPONSE: ", response.data)
        setPost(response.data.data)
      } catch (error) {
        console.error("something went wrong !!", error.message)
      }
    }
    postData()
  }, [id, isLiked])

  const handleLike = async () => {
    try {
      const isLikedState = !isLiked
      console.log("STATE: ", isLikedState)

      const response = await axios.post(`/api/v1/home/post/like/${id}`, { isLiked: isLikedState })
      console.log("LIKE RESPONSE: ", response)

      setIsLiked(isLikedState)
      localStorage.setItem("like", JSON.stringify(isLikedState))

      console.log(localStorage.getItem("like"))
      console.log(JSON.parse(localStorage.getItem("like")))
    } catch (error) {
      console.error("Something went wrong in like !!", error.message)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <div className="flex-1 lg:max-w-4xl">
            
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
              <img 
                src={post.postImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.hashtags?.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center font-bold border-2 rounded-2xl px-3 py-1.5 text-xs sm:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            
            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl mb-6">
              {post.title}
            </h1>

            
            <div className="whitespace-pre-wrap break-words text-base sm:text-lg leading-relaxed">
              {post.content}
            </div>
          </div>

          
          <div className="lg:w-64 xl:w-72">
            <div className="lg:sticky lg:top-6 space-y-6">
              
              <div 
              onClick={()=>navigate(`/home/profile/${post.owner?.username}`)}
              className="bg-base-200 cursor-pointer rounded-lg p-4 flex items-center gap-3">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={post.owner?.avatar} 
                      alt={post.owner?.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {post.owner?.username}
                  </div>
                  <div className="font-light text-sm text-gray-600 truncate">
                    {post.owner?.fullName}
                  </div>
                </div>
              </div>

              
              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex items-center justify-around gap-4">
                  
                  <div className="flex flex-col items-center gap-2">
                    <label  
                      style={{ color: "var(--label-color)" }}
                      className="tooltip tooltip-bottom cursor-pointer hover:scale-110 transition-transform"
                      data-tip="Like!"
                      onClick={handleLike}
                    >
                      {isLiked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                          <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                          <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                        </svg>
                      )}
                    </label>
                    <span className="font-semibold text-sm">{post.likes}</span>
                  </div>

                  
                  <div className="flex flex-col items-center gap-2">
                    <label style={{ color: "var(--label-color)" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                      </svg>
                    </label>
                    <span className="font-semibold text-sm">{post.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <label
          style={{ color: "var(--label-color)" }}
          className="tooltip tooltip-left border hover:bg-gray-600 cursor-pointer p-3 sm:p-4 active:scale-95 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
          data-tip="Create post!!"
          onClick={() => navigate(user ? '/home/new' : '/login')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="sm:w-[26px] sm:h-[26px]" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
          </svg>
        </label>
      </div>
    </>
  )
}

export default PostContent