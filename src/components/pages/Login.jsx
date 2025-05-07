import { useEffect, useState } from "react";
import { axiosInstance, server } from "../../constant/config";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import userAvatar from "../../assets/userAvatar.jpg";
import { FaCamera } from "react-icons/fa";
import { fileToDataString } from "../../lib/helper";
import { setIsAuthenticated, userExists } from "../../redux/reducers/auth";
import { getSocket } from "../../socket";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = getSocket();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [previewImgUrl, setPreviewImgUrl] = useState("");

  useEffect(() => {
    toast({
      title: "Success",
      className: "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
      description: "App loaded!",
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    toast({
      title: "Logging In",
      description: "Please wait...",
    });

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axiosInstance.post(
        `${server}/api/v1/user/login`,
        {
          username: userName,
          password: password,
        },
        config
      );
      dispatch(userExists(data.user));
      dispatch(setIsAuthenticated(true));
      toast({
        title: "Success",
        description: data.message,
      });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Some error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    toast({
      title: "Signing Up",
      description: "Please wait...",
    });

    const formData = new FormData();
    formData.append("avatar", selectedImage);
    formData.append("name", name);
    formData.append("username", userName);
    formData.append("password", password);

    try {
      const { data } = await axiosInstance.post(
        `${server}/api/v1/user/signup`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "multipart/form-data",
          },
        }
      );
      dispatch(userExists(data.user));
      dispatch(setIsAuthenticated(true));
      toast({
        title: "Success",
        description: data?.message || "Signup successful!",
      });
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Some error occurred",
      });
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    setSelectedImage(file);
    try {
      const imgUrl = await fileToDataString(file);
      setPreviewImgUrl(imgUrl);
    } catch (error) {
      console.error("File change error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to preview image",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-screen overflow-hidden">
      <DotPattern
        className={cn(
          "w-[100%] h-[100%] opacity-60 scale-200",
          "[mask-image:radial-gradient(600px_circle,white,transparent)]",
          "animate-pulse glow-effect"
        )}
      />
      <div className="relative font-mono z-10 flex flex-col items-center justify-center w-full h-full">
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
                    onClick={() => setPasswordToggle(false)}
                    className="absolute top-9 right-3 text-primary"
                    size={20}
                  />
                ) : (
                  <Eye
                    onClick={() => setPasswordToggle(true)}
                    className="absolute top-9 right-3 text-primary"
                    size={20}
                  />
                )}
              </div>
              <div className="cursor-pointer text-gray-400 text-xs text-end">
                Forgot password?
              </div>
              <Button
                className="w-full px-4 py-2 font-bold"
                type="submit"
                variant="outline"
                disabled={isLoading}
              >
                Login
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
            <h2 className="text-2xl text-center text-black font-bold">
              Sign Up
            </h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative rounded-full w-20 h-20 bg-red-200">
                  <img
                    src={previewImgUrl || userAvatar}
                    alt="Avatar"
                    className="w-20 h-20 border rounded-full object-cover"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
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
                    onClick={() => setPasswordToggle(false)}
                    className="absolute top-4 right-3 text-primary"
                    size={20}
                  />
                ) : (
                  <Eye
                    onClick={() => setPasswordToggle(true)}
                    className="absolute top-4 right-3 text-primary"
                    size={20}
                  />
                )}
              </div>
              <Button
                className="w-full px-4 py-2 font-bold"
                type="submit"
                variant="outline"
              >
                Sign up
              </Button>
            </form>
            <p className="text-center text-card-foreground dark:text-card">
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
