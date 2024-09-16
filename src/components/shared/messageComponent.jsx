import React from 'react'
 import { fileFormat } from '../../lib/feature'
 import RenderContent from './RenderComponent'
import { useSelector } from 'react-redux'
import moment from 'moment';

const MessageComponent = ({user,message }) => {
   const {sender,content , attachment=[],createdAt} = message
   const sameSender = sender?.id === user?.id
   //console.log(sender)
    const  timeAgo = moment(createdAt).fromNow();
  return (
    <div
     style={{
        marginBottom:"2px",    
        alignSelf:sameSender ? "flex-end":"flex-start",
    }} >
        <div className={`p-3 rounded-lg  my-0.5 md:mt-2  flex flex-col min-w-4 min-h-11 h-fit ${sameSender?`text-white bg-[#EF6144]`:`bg-[#F6F6F6]`}`}>
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
        </div>
        <div className='self-end w-full h-fit text-[8px] p-0 bg-white text-[#B0B0B0] ${sameSender?`text-white bg-orange-500`:`bg-slate-200`}'>
            read {timeAgo}
        </div>
    </div>
  )
}

export default MessageComponent
