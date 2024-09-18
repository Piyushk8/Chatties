import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateChatMutation } from '../../redux/reducers/api';
import Avatar from '../shared/Avatar';
import toast from 'react-hot-toast';

const InputFieldItem = ({ option, index, selectedItem }) => {
    const [createChat, { isLoading, isError, isSuccess }] = useCreateChatMutation();
    const [creating, setCreating] = useState(false);
    const nav = useNavigate()
    const handleCreateChat = async () => {
        try {
            const chatData= await createChat({ userId: option.id }).unwrap(); 
            console.log(chatData)
            if(chatData.exists){
              return  nav(`/chat/${chatData.chatId}`)
            }
            else if(chatData.exists==false){
                setCreating(true);
                const Id = toast.loading("creating chat..")
                if(chatData.chatId){ nav(`/chat/${chatData.chatId}`);
                 toast.success("created SuccesFully",{id:Id}) }
                else toast.error("Something went wrong")    
            }
            } catch (err) {
             toast.error("Something went wrong",{id:Id})
        } finally {
            setCreating(false);
        }
    };

    return (
        <Link>
            <li
                key={index}
                onClick={handleCreateChat}
                className={`${selectedItem === index ? 'bg-gray-200' : ''} p-2 pb-0 hover:bg-gray-200 cursor-pointer`}
            >
                <div className="flex border-b-2 pb-4 justify-start my-3">
                    <div className='mr-6'>
                        <Avatar avatar={option.avatar} />
                    </div>
                    <div className="sm:text-lg sm:text-slate-400 font-semibold overflow-x-auto text-ellipsis md:text-xl">
                        {option.name}
                    </div>
                </div>
                {/* {isError && <p className="text-red-500">Failed to create chat.</p>}
                {isSuccess && <p className="text-green-500">Chat created successfully!</p>} */}
            </li>
        </Link>
    );
};

export default InputFieldItem;
