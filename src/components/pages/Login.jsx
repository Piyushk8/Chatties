import { useEffect, useState } from "react";

const fontFamily = "belleza"; // Change to your desired font
//import {useFileHandler, useInputValidation, useStrongPassword} from "6pp"
//import { usernameValidator } from '../utils/Validators';
//import axios from 'axios';
import { axiosInstance, server } from "../../constant/config";
import { useDispatch, useSelector } from "react-redux";
//import { userExists } from '../redux/reducer/auth';
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
// import {z} from "zod";
import userAvatar from "../../assets/userAvatar.jpg";
import { FaCamera } from "react-icons/fa";
import { fileToDataString } from "../../lib/helper";
import axios from "axios";
import { setIsAuthenticated, userExists } from "../../redux/reducers/auth";
import { getSocket } from "../../socket";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import { RippleButton } from "@/components/ui/ripple-button";
import { Button } from "../ui/button";
import { Eye, EyeClosed } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const nav = useNavigate("/");
  const socket = getSocket();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [typeOfPassword, settypeOfPassword] = useState("password");
  const [selectedImage, setSelectedImage] = useState();
  const [previewImgUrl, setPreviewimgUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
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
      });
      console.log(data);
      if (data?.success === true) {
        console.log(" authenticated");
        dispatch(setIsAuthenticated(true));
        //  useSocketReconnection(isAuthenticated)
      }
      nav("/");
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "some error occured", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", selectedImage);
    formData.append("name", name);
    formData.append("username", userName);
    formData.append("password", password);

    axios
      .post(`${server}/api/v1/user/signup`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data) toast.success(res?.data?.message || "error occured");
        //toast.error(res)
      })
      .catch((err) =>
        toast.error(err?.response?.data?.message || "some error occured")
      );
  };

  // const name = useInputValidation();
  // const bio = useInputValidation("" ,);
  // const username = useInputValidation("", usernameValidator);
  // const password = useStrongPassword();
  // const avatar = useFileHandler("single" )

  const handleFileChange = async (event) => {
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
    <div className="relative  flex items-center justify-center min-h-screen w-screen overflow-hidden">
      {/* Background Layer */}
      {/* <div className="absolute inset-0 -z-10 flex justify-center items-center bg-background"> */}
        <DotPattern
          className={cn(
            "w-[100%] h-[100%] opacity-60 scale-200",
            "[mask-image:radial-gradient(600px_circle,white,transparent)]",
            "animate-pulse glow-effect" )}
        />
      {/* </div> */}

      {/* Login / Signup Content */}
      <div className="relative font-mono  z-10 flex flex-col items-center justify-center w-full h-full">
        {isLogin ? (
          <div className="p-8 space-y-6 bg-white rounded-lg shadow-2xl md:max-w-md">
            <h2 className="text-2xl font-bold text-center text-black">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-foreground dark:text-secondary">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-gray-500 px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type={passwordToggle ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 text-gray-500 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {passwordToggle ? (
                  <EyeClosed
                    onClick={() => setPasswordToggle(false)} // Toggle to show password
                    className="absolute top-9 right-3 text-primary"
                    size={20}
                  />
                ) : (
                  <Eye
                    onClick={() => setPasswordToggle(true)} // Toggle to hide password
                    className="absolute top-9 right-3 text-primary"
                    size={20}
                  />
                )}
              </div>
              <div
                onClick={() => {}}
                className="cursor-pointer text-gray-400 text-xs text-end"
              >
                forgot passsword ?
              </div>
              <Button
                className="w-full  px-4 py-2 font-bold"
                type="submit"
                variant="outline"
              >
                Login In
              </Button>
            </form>
            <p className="text-center text-card-foreground dark:text-card">
              New user?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Create an account
              </span>
            </p>
          </div>
        ) : (
          <div className="p-8 space-y-6 bg-white rounded-lg shadow-2xl md:max-w-md">
            <h2 className="text-2xl  text-center text-black font-bold">
              Sign Up
            </h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className=" flex flex-col items-center">
                <div className="relative rounded-full w-20 h-20 bg-red-200">
                <img
                  src={previewImgUrl || userAvatar}
                  alt="Avatar"
                  className="w-20 h-20 border rounded-full object-cover"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <FaCamera
                    size={30}
                    className="absolute bottom-1 right-0 text-muted z-10"
                  />
                </label>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-gray-500 px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 text-gray-500 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <input
                  type={passwordToggle ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-gray-500 px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {passwordToggle ? (
                  <EyeClosed
                    onClick={() => setPasswordToggle(false)} // Toggle to show password
                    className="absolute top-4
                     right-3 text-primary"
                    size={20}
                  />
                ) : (
                  <Eye
                    onClick={() => setPasswordToggle(true)} // Toggle to hide password
                    className="absolute top-4 right-3 text-primary"
                    size={20}
                  />
                )}
              </div>
              {/* <button
                type="submit"
                className="w-full  px-4 py-2 font-bold "
              >
                Sign up
              </button> */}
              <Button
                className="w-full  px-4 py-2 font-bold"
                type="submit"
                variant="outline"
              >
                Sign up
              </Button>
            </form>
            <p className="text-center text-card-foreground dark:text-card ">
              Already have an account?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export { Login };
