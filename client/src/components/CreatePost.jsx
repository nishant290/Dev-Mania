import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CreatePost() {

  const [formData, setFormData] = useState({
    postImage: null,
    title: "",
    content: "",
    hashtags: [],
  })

  const navigate = useNavigate()

  const [hashTags, setHashTags] = useState(() => {
    const saved = sessionStorage.getItem('hashTags')
    return saved ? JSON.parse(saved) : []
  })
  const [inputVal, setInputVal] = useState('')

  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    sessionStorage.setItem('hashTags', JSON.stringify(hashTags))
  }, [hashTags])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.name === "postImage" ? e.target?.files[0] : e.target.value })
  }

  const handleTags = (e) => {
    if (inputVal.trim()) {
      const input = inputVal.trim().replace(/\s+/g, '_')
      const updatedTags = [...hashTags, input]
      setHashTags(updatedTags)
      setFormData({ ...formData, hashtags: updatedTags })
      console.log(sessionStorage)
      setInputVal('')
    }
  }

  const handleImage = () => {
    setFormData({ ...formData, postImage: null })
  }

  const removeTag = (indexToRemove) => {
    setHashTags(hashTags.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTags();
    }
  };

  const [isClicked, setIsClicked] = useState(false)

  const data = new FormData()
  data.append("postImage", formData.postImage)
  data.append("title", formData.title)
  data.append("content", formData.content)

  formData.hashtags.forEach((tag) => {
    data.append("hashtags[]", tag)
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log(formData)
    console.log(data)

    setIsClicked(true)

    try {

      const response = await axios.post('/api/v1/home/post', data)
      console.log(response.data)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        navigate('/home')
      }, [2500])

    } catch (error) {

      console.log(error)
      console.error("Something Went Wrong !!!", error.response?.data?.message || error.message)
      setIsClicked(false)
    }
  }

  return (
    <>
      <div className="body flex flex-col lg:flex-row min-h-screen pb-24 lg:pb-0 px-4 sm:px-6 lg:px-8">
        {/* Main Content Area */}
        <div className="right-side flex-1 w-full lg:w-2/3 py-6">
          {/* Cover Image Section */}
          <div className="add-covr-img mb-6">
            <input
              onChange={handleChange}
              type="file"
              accept='image/*'
              id="image-uploader"
              className="hidden"
              name="postImage"
              alt="cover-image"
            />

            {formData.postImage !== null && (
              <div className='flex flex-col sm:flex-row items-center gap-4 w-full'>
                <div className='w-full sm:w-auto flex justify-center'>
                  <img
                    className='object-cover w-full sm:w-64 md:w-80 h-40 sm:h-48 rounded-lg'
                    src={URL.createObjectURL(formData.postImage)}
                    alt='Post-Image'
                  />
                </div>
                <div className='flex flex-row sm:flex-row gap-8 '>
                  <label
                    htmlFor="image-uploader"
                    className='btn btn-outline cursor-pointer text-sm sm:text-base px-4 py-2 rounded-md'
                  >
                    Change image
                  </label>
                  <button
                    onClick={handleImage}
                    style={{ color: 'red' }}
                    className='btn btn-outline cursor-pointer text-sm sm:text-base px-4 py-2 rounded-md'
                  >
                    Remove image
                  </button>
                </div>
              </div>
            )}

            {formData.postImage === null && (
              <label
                htmlFor="image-uploader"
                className='btn btn-outline cursor-pointer w-full sm:w-auto px-6 py-3 rounded-md'
              >
                Add a cover image
              </label>
            )}
          </div>

          {/* Title Area */}
          <div className="title-area mb-6">
            <textarea
              onChange={handleChange}
              className="textarea w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl border-hidden scroll-auto font-extrabold resize-none overflow-y-auto min-h-20 max-h-32 rounded-lg"
              name='title'
              placeholder="Add the title..."
            />
          </div>

          {/* Content Area */}
          <div className="body-area mb-6">
            <textarea
              onChange={handleChange}
              className="textarea w-full text-sm sm:text-base md:text-lg border-hidden scroll-auto font-medium resize-none overflow-y-auto min-h-40 h-48 sm:h-56 md:h-64 rounded-lg"
              name='content'
              placeholder="Write your post content here..."
            />
          </div>
        </div>

        {/* Sidebar for Hashtags */}
        <div className="left-side w-full lg:w-1/3 py-6 lg:pl-6">
          <div className="hashtags mb-6 w-full">
            {/* Hashtag Input */}
            <div className="container flex flex-row sm:flex-row gap-3 mb-4">
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="#Tag"
                name='hashtags'
                className="input flex-1 text-sm sm:text-base"
              />
              <button
                onClick={handleTags}
                className='btn rounded-2xl w-22 sm:w-auto px-6'
              >
                Add
              </button>
            </div>

            {/* Hashtags Display */}
            <div className="bucket max-h-48 md:max-h-64 w-full overflow-y-auto p-4 ">
              <div className="flex flex-wrap gap-2">
                {hashTags.map((tag, index) => (
                  <span
                    onChange={handleChange}
                    key={index}
                    className='inline-flex items-center font-bold border-2 rounded-2xl px-3 py-1.5 text-xs sm:text-sm'
                  >
                    {tag}
                    <button
                      className='ml-2 hover:cursor-pointer font-bold'
                      onClick={() => removeTag(index)}
                      style={{ color: 'red' }}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button - Fixed on Mobile, Static on Desktop */}
          <div className="btun-class fixed bottom-0 left-0 right-0 lg:bottom-12 lg:right-22 lg:left-auto p-4 lg:p-0 bg-base-100 lg:bg-transparent border-t lg:border-t-0 z-50 lg:w-auto">
            <button
              onClick={handleSubmit}
              className="btn w-full lg:w-80 lg:btn-wide text-sm sm:text-base"
              disabled={isClicked}
            >
              {isClicked ? <span className="loading loading-spinner loading-sm"></span> : "Create post"}
            </button>
          </div>

          {showSuccess && (
            <div className="modal modal-open">
              <div className="modal-box text-center">
                <div className="text-6xl mb-4">✓</div>
                <h3 className="font-bold text-lg">Success!</h3>
                <p className="py-4">Your post has been created successfully</p>
              </div>
              <div className="modal-backdrop bg-black/50 backdrop-blur-sm"></div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CreatePost