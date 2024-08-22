import React from 'react'
// import { fileFormat } from '../../lib/features'
// import RenderContent from './RenderContent'
import { useSelector } from 'react-redux'
import moment from 'moment';

const MessageComponent = ({user,message }) => {
   const {sender,content , attachments=[],createdAt} = message
   const sameSender = sender.id === user?.id
    const  timeAgo = moment(createdAt).fromNow();
    
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
            attachments.length>0  && attachments.map((attachment,index)=>{
            const url = attachment.url;
            const file =fileFormat(url);
            // console.log(RenderContent(url,file));
            return ( 
                <Box key={index}>
                    <a href='' target='_blank' download  style={{color:"black"}} >
                        {RenderContent({url,file})}
                    </a> 
                </Box>);
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
