import React, { Suspense, useEffect } from 'react'
import {Route,Routes,BrowserRouter} from "react-router-dom"
import Home from './components/pages/Home'

import { SocketProvider } from './socket'
import {Login} from './components/pages/login'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { server } from './constant/config'
import { userExists, userNotExists } from './redux/reducers/auth'
import { Toaster } from 'react-hot-toast'
import ProtectRoute from './components/auth/ProtectRoute'
import { FaSpinner } from 'react-icons/fa'
import Chat from './components/pages/Chat'


const App = () => {
  const {user,Loader} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`,{
      withCredentials:true
    }).then((res)=>{
      return dispatch(userExists(res.data.user))
    }).catch((err)=>dispatch(userNotExists()))
  },[dispatch])

  return Loader ? (
   "ehllo"
  ) : (
    <BrowserRouter>
      <Suspense>
      <Routes>
      
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home/>} />
            <Route path="/chat/:chatId" element={<Chat/>} />
            {/* <Route path="/:asd" element={<NotFound/>} /> */}

            
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
            />

          
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

export default App
