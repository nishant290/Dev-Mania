import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Home from './components/Home'
import './App.css'
import { ToastContainer } from 'react-toastify'
import { UserProvider, useUserData } from './components/UserContext'
import Navbar from './components/Navbar'
import UserProfile from './components/UserProfile'
import AllUsers from './components/AllUsers'
import CreatePost from './components/CreatePost'
import PostContent from './components/PostContent'

function App() {

  // const {user} = useUserData()

  return (
      <BrowserRouter>
        <UserProvider>
        <Navbar/>
        <ToastContainer position='top-right' autoClose={2000} />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/home' element={<Home />} />
          <Route path={`/home/profile/:username`} element={<UserProfile />} />
          <Route path='/home/profile/all-users' element={<AllUsers />} />
          <Route path='/home/new' element={<CreatePost />} />
          <Route path={`/home/post/:id`} element={<PostContent />} />
        </Routes>
        </UserProvider>
      </BrowserRouter>
  )
}

export default App
