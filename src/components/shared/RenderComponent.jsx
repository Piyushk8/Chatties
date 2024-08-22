import React from 'react'
import { transformImage } from '../../lib/features';
import { FileOpen } from '@mui/icons-material';

const RenderContent = ({file,url}) => {
  
    switch (file){
        case "video":
            return <video preload='none' width={"200px"} controls src={url}/>
            
        case "image":
            return ( <img 
                width={"200px"}
                height={"150px"}
                style={{objectFit:"contain"}}
                src={transformImage(url)} alt='atatchemnt'></img>
            );
        case "audio":
            return <audio src={url} preload='none' controls></audio>           
            
    default:
    return<div className="flex items-center justify-center">
    <label
      htmlFor="file-upload"
      className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
    >
      Choose File
    </label>
    <input
      id="file-upload"
      type="file"
      className="hidden"
      onChange={handleFileChange} // Handle file change event in your component
    />
  </div>
        }

 
}