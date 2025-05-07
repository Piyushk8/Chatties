import React, { lazy, Suspense, useEffect } from 'react'
import {Route,Routes,BrowserRouter} from "react-router-dom"
import { SocketProvider } from './socket'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { server } from './constant/config'
import { setIsAuthenticated, userExists, userNotExists } from './redux/reducers/auth'
// import { Toaster } from 'react-hot-toast'
import ProtectRoute from './components/auth/ProtectRoute'
import MainLoader from './components/Layout/MainLoader'

import { Login } from './components/pages/Login'
import { setMuteChatsArray, setPinnedChatsArray } from './redux/reducers/chat'
import { ThemeProvider } from './components/theme-provider'
import Group from './components/pages/Group'
import { Toaster } from 'sonner'
//const {Login} = lazy(()=>import('./components/pages/Login'))
const Chat = lazy(()=>import('./components/pages/Chat'))
const Home = lazy(()=>import('./components/pages/Home'))

const App = () => {
  const {user,Loader} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`,{
      withCredentials:true
    }).then((res)=>{
      dispatch(setIsAuthenticated(true))
      dispatch(setPinnedChatsArray(res?.data?.pinnedChats))
      dispatch(setMuteChatsArray(res?.data?.mutedChatIds))
      return dispatch(userExists(res?.data?.user))
    }).catch((err)=>{
      dispatch(setIsAuthenticated(false))
      dispatch(userNotExists())})
  },[dispatch])

  return Loader ? (
   <MainLoader/>
  ) : (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
        <SocketProvider>
      <Suspense>
      <Routes>
      
          <Route
            element={
              <ProtectRoute user={user} />
            }
            >
            <Route path="/" element={<Home/>} />
            <Route path="/chat/:chatId" element={<Chat/>} />
            <Route path="/group/:groupId" element={<Group/>} />
            {/* <Route path="/:asd" element={<NotFound/>} /> */}

            
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login/>
              </ProtectRoute>
            }
            />

          
        </Routes>
      </Suspense>
            </SocketProvider>

      {/* <Toaster position="bottom-center" /> */}
<Toaster position='bottom'/>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
