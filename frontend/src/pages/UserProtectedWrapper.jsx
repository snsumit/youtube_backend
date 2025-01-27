import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
const UserProtectedWrapper = ({children}) => {
  const navigate = useNavigate();

  
  const token = localStorage.getItem('accessToken')
  useEffect(()=>{
   
      if(!token){
           navigate('/login')
      }
  },[token])
  
  
  
    return (
    <div>
       {children}
    </div>
  )
}

export default UserProtectedWrapper
