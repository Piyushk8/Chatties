import React from 'react'
import mainLogo from "../../assets/mainLogo.png"
const Navbar = () => {
  return (
    // <div>
       <div className='header flex justify-center items-center w-full bg-[#ffff] shadow-sm h-[4.3rem] md:h-[6.3rem]'>
                  <div className='bg-slate-100 h-[60%] w-[95%] flex justify-between'>
                      <div onClick={()=>nav("/")} className='cursor-pointer   h-full w-fit  flex font-extrabold text-gray-500 justify-center items-center'><img src={mainLogo} className='w-full text-black h-full ' alt="///" /><span className=' p-3 pl-0'>Chatties</span></div>
                            {/* popover */}
                        <div>
                           
                       </div>
              </div>
    // </div>
  )
}

export default Navbar
