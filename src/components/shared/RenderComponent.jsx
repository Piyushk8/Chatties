import React from 'react'
const transformImage = (url = "", width = 100) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);

  return newUrl;
};


const RenderContent = ({file,url}) => {
  
    switch (file){
        case "video":
            return <video preload='none' width={"100px"} controls src={url}/>
            
        case "image":
            return ( <img 
                width={"150px"}
                height={"100px"}
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
export default RenderContent;