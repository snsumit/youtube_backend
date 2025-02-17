import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const UserLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,
      [name]: value
    }))

  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, formData);
      if (response.status === 200) {
        const { data } = response.data;
       
        const accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        toast.success("Login SuccessFully")
        setTimeout(() => navigate('/home'), 1000);
      }
    } catch (error) {
      toast.error("Something went wrong pls try again")
      console.log(error)
    }


    setFormData({
      email: "",
      password: ""
    })
  }

  return (

    <div className="min-h-screen bg-white p-8 rounded-2xl w-full max-w-md">
      <Toaster position='top-right' />
      <h2 className="text-2xl font-semibold mb-6  text-gray-800">PlayCraft</h2>
      <form className="space-y-6" onSubmit={handleFormSubmit} >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            value={formData.email}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"

            name="email"
            type="text"
            onChange={handleChange}
            placeholder="john.doe@example.com"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input

            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"

            name="password"
            value={formData.password}
            type="text"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>


        <div>
          <button
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            type="submit"
          >
            Log In
          </button>
        </div>
      </form>


      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-blue-600 hover:text-purple-500">
          Sign up
        </Link>
      </p>
    </div>

  );
}

export default UserLoginPage
