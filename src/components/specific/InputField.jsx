import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { server } from '../../constant/config';
import Avatar from '../shared/Avatar';
import InputFieldItem from './InputFieldItem';

const SearchInput = () => {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility
    const [selectedItem, setselectedItem] = useState(-1)
    
    const dropdownRef = useRef(null); // Ref to the dropdown container

    useEffect(() => {
        const fetchOptions = async () => {
            if (query.length === 0) {
                setOptions([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                // Fetch data from the API
                const response = await axios.get(`${server}/api/v1/user/search?filter=${query}`, { withCredentials: true });
                console.log(response)
                setOptions(response.data.users); // Ensure correct response structure
            } catch (err) {
                console.error("Error fetching options:", err);
                setError("Failed to load options");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOptions();

    }, [query]); // Fetch new options when query changes


    // Toggle dropdown visibility
    const handleInputClick = () => {
        setIsOpen((prev) => !prev);
    };
    const handleClearClick = () => {
        setQuery("");
        setOptions([])
    };
    const handleKeyDown=(e)=>{
       if(selectedItem<options.length){
        if(e.key === "ArrowUp" && selectedItem >0){
            setselectedItem((prev)=>prev-1)
        }
        else if(e.key === "ArrowDown" && selectedItem<options.length-1){
            setselectedItem((prev)=>prev+1)
        }
        else if(e.key === "Enter" && selectedItem>=0){
            //!create chat
            console.log("enter")
        }
       }
       else{
        setselectedItem(-1)
       }
    }
    return (
        <div className="relative w-full">
                        
            <input
            type="text"
            value={query}
            onClick={handleInputClick}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Search..."
            onKeyDown={handleKeyDown}
            />
            {/* <div><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </div> */}
            {isOpen && (<>

            {isLoading && (
            <div className="absolute top-full left-0 right-0 p-2 bg-white border border-t-0 border-gray-300 rounded-b">
                Loading...
            </div>
            )}
            {error && (
            <div className="absolute top-full left-0 right-0 p-2 bg-white border border-t-0 border-gray-300 rounded-b text-red-500">
                {error}
            </div>
            )}
            {options.length > 0 && (
            <ul className="absolute scrollbar-none top-full w-[20rem] left-0 right-0 max-h-60 overflow-y-auto bg-white border border-t-0 border-gray-300 rounded-b z-10">
                {options.map((option, index) => (
                  <InputFieldItem selectedItem={selectedItem} option={option} index={index} />
                ))}
            </ul>
            )}


</>)}
        </div>
    );
};

export default SearchInput;



