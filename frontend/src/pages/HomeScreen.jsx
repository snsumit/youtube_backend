import React from 'react'
import { Link } from 'react-router-dom'
const HomeScreen = () => {
  return (
    <div className="relative overflow-hidden h-screen flex flex-col gap-8  ">
        <h1 className='absolute text-white font-semibold text-2xl left-4 top-4'>PlayCraft</h1>
        <div className='h-full object-cover'>
            <img className='h-full' src="https://images.news18.com/ibnlive/uploads/2022/03/vanced-app-shut-down.jpg" alt="" />
        </div>

        <Link to='/register' className='ml-4 text-center rounded text-white font-semibold py-2 px-4 w-86 mb-6  bg-blue-500  '>
            Continue
        </Link>
    </div>
  )
}

export default HomeScreen
