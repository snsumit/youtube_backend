import React from 'react'
import UserRegisterPage from './pages/UserRegisterPage'
import UserLoginPage from './pages/UserLoginPage'
import HomeScreen from './pages/HomeScreen'
import { Routes ,Route } from 'react-router-dom'
import Home from './pages/Home'

const App = () => {
  return (
    <>
       <Routes>
           <Route path='/home' element={<Home />} />
           <Route path='/' element={<HomeScreen />} />
           <Route path='/register' element={<UserRegisterPage />} />
           <Route path='/login' element={<UserLoginPage />} />
             
       </Routes>


    </>
  )
}

export default App
