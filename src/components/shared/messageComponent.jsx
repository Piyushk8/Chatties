import React from 'react'
 import { fileFormat } from '../../lib/feature'
 import RenderContent from './RenderComponent'
import { useSelector } from 'react-redux'
import moment from 'moment';

const MessageComponent = ({user,message }) => {
   const {sender,content , attachment=[],createdAt} = message
   const sameSender = sender.id === user?.id
    const  timeAgo = moment(createdAt).fromNow();
    console.log(attachment?.length)
  return (
    <div style={{
        alignSelf:sameSender ? "flex-end":"flex-start",
        borderRadius:"8px" ,
        padding:"0.5rem"
        ,width:"fit-content",
        
    }} className={`my-0.5 md:my-2  flex flex-col min-w-4 h-fit ${sameSender?`text-white bg-orange-500`:`bg-slate-200`}`}>

        {content ? <div>{content}</div> : ""}
        <div className='py-1 ' >
        {
            attachment?.length>0  && attachment?.map((attachment,index)=>{
            const url = attachment;
            const file =fileFormat(url);
            // console.log(RenderContent(url,file));
            return ( 
                <div key={index}>
                    <a href='' target='_blank' download  style={{color:"black"}} >
                        {RenderContent({url,file})}
                    </a> 
                </div>);
            })
        }
        </div>
        <div className='self-end text-[8px] ${sameSender?`text-white bg-orange-500`:`bg-slate-200`}'>
            {timeAgo}
        </div>
    </div>
  )
}

export default MessageComponent
