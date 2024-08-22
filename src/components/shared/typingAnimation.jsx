import React from 'react'

const TypingAnimation = () => {
  return (
    <div className='flex gap-4 mb-4 h-full w-full bg-black '> 
       <div className="bg-slate-600 animate-bounce w-6 h-6 rounded-full">

       </div>
       <div className="animate-bounce bg-slate-600 rounded-full w-6 h-6"></div>
       <div className="animate-bounce bg-slate-600 rounded-full w-6 h-6"></div>


    </div>
  )
}

export default TypingAnimation