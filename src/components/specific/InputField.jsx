import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../constant/config";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2, SearchIcon } from "lucide-react";
import InputFieldItem from "./InputFieldItem"; // For users
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "@/redux/reducers/misc";
import GroupItem from "./GroupInputItem";

const SearchInputWithDialog = () => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState("users"); // Toggle between "users" and "groups"
  const [error, setError] = useState(null);

  const { isSearchOpen } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const fetchOptions = async () => {
    if (query.length === 0) {
      setOptions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        selection === "users"
          ? `${server}/api/v1/user/search?filter=${query}`
          : `${server}/api/v1/group/search?filter=${query}`,
        { withCredentials: true }
      );

      setOptions(response.data.users || response.data.groups);
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
  }, [query, selection]);

  const handleInputChange = (e) => setQuery(e.target.value);
  const handleInputClick = () => dispatch(setIsSearch(true));
  const handleDialogClose = () => {
    dispatch(setIsSearch(false));
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
            <DialogTitle>Search for Users and Groups</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              className="w-full bg-input p-2 border border-border rounded mb-2"
              placeholder="Type to search..."
            />
            {isLoading && <Loader2 size={20} className="absolute right-3 top-3 animate-spin" />}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Tab Selection */}
          <div className="flex gap-4">
            <div
              onClick={() => setSelection("users")}
              className={`${selection === "users" && "bg-muted"} text-sm px-2 py-1 border text-card-foreground border-border rounded-2xl hover:bg-muted cursor-pointer`}
            >
              Users
            </div>
            <div
              onClick={() => setSelection("groups")}
              className={`${selection === "groups" && "bg-muted"} text-sm px-2 py-1 border text-card-foreground border-border rounded-2xl hover:bg-muted cursor-pointer`}
            >
              Groups
            </div>
          </div>

          {/* Render Users or Groups Dynamically */}
          <div className="mt-2 max-h-60 overflow-y-auto">
            {options.length > 0 ? (
              <ul>
                {options.map((option, index) =>
                  selection === "users" ? (
                    <InputFieldItem key={option.id} option={option} index={index} selected={selection} />
                  ) : (
                    <GroupItem key={option.id} group={option} index={index} />
                  )
                )}
              </ul>
            ) : (
              !isLoading && <p className="text-secondary">No results found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchInputWithDialog;
