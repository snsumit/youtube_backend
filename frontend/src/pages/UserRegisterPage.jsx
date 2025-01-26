import React,{useState,useRef} from 'react'
import { Link } from 'react-router-dom';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const UserRegisterPage = () => {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const avatarfileInputRef = useRef(null)
  const coverfileInputRef = useRef(null)
  const navigate = useNavigate()
  const handleFileChange = (e,type) =>{
    const file = e.target.files[0];
    if(file){
    
      if(type === "avatar"){
        setAvatar(file)
      }
      if(type === "cover"){
        setCover(file)
      }
    }

}

  const handleFormSubmit = async (e) =>{
     e.preventDefault();
    const formData = new FormData();
    formData.append("fullName",fullName);
    formData.append("email",email);
    formData.append("username",username);
    formData.append("password",password);
    formData.append("avatar",avatar);
    formData.append("coverImage",cover);


    try{
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })

      if(response.status ===201){
         toast.success('SuccessFully Registerd');
         setTimeout(() => navigate('/login'), 2000); // Delay navigation
      }

      
    }catch(error){  
      console.log(error)
      toast.error('Something went wrong');
    }
    
    setFullName("");
    setPassword("");
    setEmail("");
    setUsername("");

    if(avatarfileInputRef.current && coverfileInputRef.current){
        avatarfileInputRef.current.value = ""
        coverfileInputRef.current.value = ""
    }
    
  }

  


    
 return (
   <>
   
    <div className="min-h-screen flex items-center justify-center ">
      <Toaster position='top-right' />   
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">PlayCraft</h2>
        <form className="space-y-2" onSubmit={handleFormSubmit}>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={fullName}
              type="text"
              placeholder="John Doe"
              onChange={(e)=>setFullName(e.target.value)}
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={email}
              type="text"
              placeholder="john.doe@example.com"
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={password}

              type="text"
              placeholder="Password"
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={username}
              type="text"
              placeholder="johndoe123"
              onChange={(e)=>setUsername(e.target.value)}
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="avatar">
              Profile Picture
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-blue-500"
             
              type="file"
              onChange={(e)=>handleFileChange(e,"avatar")}
              ref={avatarfileInputRef}
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="coverImage">
              Cover Image
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-blue-500"
             
              type="file"
              onChange={(e)=>handleFileChange(e,"cover")}
              ref={coverfileInputRef}
            />
          </div>

         
          <div>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>

        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-500 ">
            Log in
          </Link>
        </p>
      </div>
    </div>
    </>

  );
}

export default UserRegisterPage


