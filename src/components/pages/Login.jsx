import {useEffect, useState} from 'react'

const fontFamily = "belleza"; // Change to your desired font
//import {useFileHandler, useInputValidation, useStrongPassword} from "6pp"
//import { usernameValidator } from '../utils/Validators';
//import axios from 'axios';
import { axiosInstance, server } from '../../constant/config';
import { useDispatch , useSelector} from 'react-redux';
//import { userExists } from '../redux/reducer/auth';
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
// import {z} from "zod";
import userAvatar from   "../../assets/userAvatar.jpg"
import { FaCamera } from 'react-icons/fa';
import { fileToDataString } from '../../lib/helper';
import axios from "axios";
import { setIsAuthenticated, userExists } from '../../redux/reducers/auth';
import { getSocket} from '../../socket';



 const Login = ()=> {
  const dispatch = useDispatch();
  const nav = useNavigate("/")
  const socket = getSocket()
  const {isAuthenticated } = useSelector((state)=>state.auth)
 
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [typeOfPassword, settypeOfPassword] = useState("password")
  const [selectedImage,setSelectedImage] = useState();
  const [previewImgUrl, setPreviewimgUrl] = useState("");
  const [progress, setProgress] = useState(0)

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [userName, setUserName] = useState("")
  
  
  const handleLogin = async(e)=>{
    e.preventDefault()
    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      try {
        const { data } = await axios.post(
          `${server}/api/v1/user/login`,
          {
            username: userName,
            password: password,
          },
          config
        );
        dispatch(userExists(data.user));
        toast.success(data.message, {
          id: toastId,
        })
        console.log(data)
         if(data?.success===true){
           console.log(" authenticated")
          dispatch(setIsAuthenticated(true))
        //  useSocketReconnection(isAuthenticated)
         }
        nav("/")

      } catch (error) {
        console.log("error",error)
        toast.error(error?.response?.data?.message||"some error occured" , {
          id: toastId,
        });
      } finally {
        setIsLoading(false);
      }
    };
    const handleSignUp = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("avatar",selectedImage);
        formData.append("name", name);
        formData.append("username",userName);
        formData.append("password",password);

        axios.post(`${server}/api/v1/user/signup`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data" ,
            Accept: "multipart/form-data",
          }
        }).then((res)=>{
          
          if(res.data)toast.success(res?.data?.message||"error occured")
          //toast.error(res)
        })
          .catch((err)=>toast.error(err?.response?.data?.message||"some error occured")
        )
          }
    

  // const name = useInputValidation();
  // const bio = useInputValidation("" ,);
  // const username = useInputValidation("", usernameValidator);
  // const password = useStrongPassword();
  // const avatar = useFileHandler("single" )
  
  const handleFileChange = async(
    event
  ) => {
   const file = event.target.files;
    setSelectedImage(file?.[0]);
    try {
      const imgUrl = await fileToDataString(file?.[0]);
      setPreviewimgUrl(imgUrl);
    } catch (error) {
      console.log(error);
    }  
  
  };
 
  return (
    <div 
    className='h-screen flex flex-col justify-center items-center  overflow-hidden w-screen'>
    <div>
{/* login section */}
        {isLogin ?
          <div className=" overflow-y-auto scrollbar-none flex flex-col justify-center p-8 space-y-6 bg-[#FEF4F2]  shadow-2xl rounded-lg  ">
            <h2 className="text-2xl font-bold text-center text-[gray]">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#B0B0B0]">Username</label>
                <input type="username" placeholder='Piyushk8' onChange={(e)=>setUserName(e.target.value)}  className="w-full px-4 py-2 mt-1  rounded-md  focus:none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B0B0]">Password</label>
                <input placeholder='12345' onChange={(e)=>setPassword(e.target.value)}  type="password" className="w-full focus:outline-none focus:shadow-none hover:outline-none hover:shadow-none active:outline-none active:shadow-none  px-4 py-2 mt-1  rounded-md " />
              </div>
              <button  type="submit" className="w-full px-4 py-2 font-bold text-white bg-[#EF6144] rounded-3xl hover:bg-orange-500">
                Login
              </button>
            </form>
            <p className='self-center text-[#B0B0B0]' >New user? <p className='inline text-[#EF6144] ' onClick={()=>setIsLogin(false)}>create account</p></p>
          </div>
        :
//Signup section text-[#B0B0B0]">Already user? <p className='inline text-[#EF6144]'
        <div className="overflow-y-auto scrollbar-none flex flex-col w-full max-w-md  p-8 space-y-6 bg-[#FEF4F2] shadow-2xl rounded-lg sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-[gray] ">SIGN UP</h2>
        <form className="space-y-4 " onSubmit={handleSignUp}>
          <div className=" Avatar flex flex-col">
             
              <img className='self-center h-20 w-20 rounded-full object-fill' src={previewImgUrl || userAvatar} />
         
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                  <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg> */}

          
          
            <label htmlFor="file-upload" className="cursor-pointer relative">
                    <FaCamera className="text-2xl absolute text-gray-500 hover:text-gray-600 bottom-0 right-16 " />
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#B0B0B0]">Username</label>
            <input onChange={(e)=>setUserName(e.target.value)} type="username" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#B0B0B0]">Name</label>
            <input onChange={(e)=>setName(e.target.value)} type="name" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#B0B0B0]">Password</label>
            <input onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full px-4 py-2 mt-1  rounded-md " />
          </div>
          <button type="submit" className="w-full px-4 py-2 font-bold text-white rounded-3xl bg-[#EF6144] hover:bg-orange-500">
                Sign up
          </button>
        </form>
        <p className="self-center text-[#B0B0B0]">Already user? <p className='inline text-[#EF6144]' onClick={()=>setIsLogin(true)}>Sign In</p></p>
          
      </div>
        
        }

        
    </div>
   </div>
  )
}



export {
  Login
}



