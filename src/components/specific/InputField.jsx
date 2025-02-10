import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { server } from "../../constant/config";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2, SearchIcon } from "lucide-react";
import InputFieldItem from "./InputFieldItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "@/redux/reducers/misc";

const SearchInputWithDialog = () => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selections, setSearchSelection] = useState("users")
  const [error, setError] = useState(null);
  // const [isOpen, setIsOpen] = useState(false);
  const {isSearchOpen} = useSelector((state)=>state.misc)
  const dispatch = useDispatch()
  const fetchOptions = async () => {
    if (query.length === 0) {
      setOptions([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        selections === "users" ? `${server}/api/v1/user/search?filter=${query}`:`${server}/api/v1/group/search?filter=${query}`,
        { withCredentials: true }
      );
      setOptions(response.data.users || response?.data?.groups);
    } catch (err) {
      setError("Failed to load options");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) fetchOptions();
    }, 300); // Debounce input

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleInputClick = () => {
    dispatch(setIsSearch(true))
  };
  
  const handleDialogClose = () => {
    dispatch(setIsSearch(false))
    setQuery("");
    setOptions([]);
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          onClick={handleInputClick}
          className="w-full bg-input dark:bg-card-foreground border-primary text-primary p-2 border-none dark:border-[1px]  rounded-lg"
          placeholder="Search..."
          readOnly
        />
        <SearchIcon size={20} className="text-primary absolute top-3 right-3 opacity-50" />
      </div>

      <Dialog open={isSearchOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Search for Users and Channels</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              className="w-full bg-input p-2 border border-border rounded mb-2"
              placeholder="Type to search..."
            />
            {isLoading && (
              <Loader2
                size={20}
                className="absolute right-3 top-3 animate-spin"
              />
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <div className="flex gap-4">
            <div onClick={()=>setSearchSelection("users")} className={`${selections==="users" && "bg-muted"} test-sm px-2 py-1 border text-card-foreground border-border rounded-2xl hover:bg-muted`}>users</div>
            <div onClick={()=>setSearchSelection("groups")} className={`${selections==="groups" && "bg-muted"} test-sm px-2 py-1 border text-card-foreground border-border rounded-2xl hover:bg-muted`}>Channels/Groups</div>
          </div>
          <div className="mt-2 max-h-60 overflow-y-auto">
            {options.length > 0 ? (
              <ul>
                {options.map((option, index) => (
                  <InputFieldItem
                    // selectedItem={selectedItem}
                    selected={selections}
                    option={option}
                    index={index}
                  />
                ))}
              </ul>
            ) : (
              !isLoading && <p className="text-secondary">No results found</p>
            )}
          </div>
        </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchInputWithDialog;
