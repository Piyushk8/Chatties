import React, { useRef, useState, useTransition } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { useDispatch, useSelector } from "react-redux";
import { setIsCreateGroup } from "@/redux/reducers/misc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Camera } from "lucide-react";
import { server } from "@/constant/config";
import { Switch } from "../ui/switch"; // Import Switch component

const formSchema = z.object({
  groupname: z.string().min(2, "Group name must be at least 2 characters."),
  members: z.array(z.string()).min(1, "Select at least one member."),
  isPrivate: z.boolean().default(false), // Private/Public toggle
});

const CreateGroupDialog = () => {
  const { isCreateGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [fileAvatar, setFileAvatar] = useState(null);
  const [isPending, startTransition] = useTransition();
  const ImageRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupname: "",
      members: [],
      isPrivate: false, // Default to public group
    },
  });

  // Function to load users dynamically
  const loadOptions = async (inputValue, callback) => {
    try {
      const response = await axios.get(`${server}/api/v1/user/search?filter=${inputValue}`, { withCredentials: true });
      const userOptions = response.data.users.map(user => ({ value: user.id, label: user.name }));
      callback(userOptions);
    } catch (error) {
      console.error("Error fetching users:", error);
      callback([]);
    }
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("groupName", values.groupname);
    formData.append("avatar", fileAvatar);
    formData.append("members", JSON.stringify(values.members));
    formData.append("isPrivate", values.isPrivate); // Send isPrivate option

    startTransition(async () => {
      try {
        const response = await axios.post(`${server}/api/v1/group/new`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          setFileAvatar(null);
          form.reset();
          dispatch(setIsCreateGroup(false));
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={isCreateGroup} onOpenChange={() => dispatch(setIsCreateGroup(false))}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create Group</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Group Avatar */}
            <FormItem className="flex justify-center">
              <FormControl>
                <div onClick={() => ImageRef.current.click()} className="relative w-20 h-20 rounded-full">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={fileAvatar} />
                    <AvatarFallback>{"G"}</AvatarFallback>
                  </Avatar>
                  <Camera className="absolute top-6 right-6" size={30} />
                  <input
                    accept="image/*"
                    type="file"
                    ref={ImageRef}
                    className="hidden"
                    onChange={(e) => setFileAvatar(URL.createObjectURL(e.target.files[0]))}
                  />
                </div>
              </FormControl>
            </FormItem>

            {/* Group Name */}
            <FormField control={form.control} name="groupname" render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter group name" />
                </FormControl>
              </FormItem>
            )} />

            {/* Async Member Selection */}
            <FormField control={form.control} name="members" render={({ field }) => (
              <FormItem>
                <FormLabel>Select Members</FormLabel>
                <FormControl>
                  <AsyncSelect
                    className="bg-card text-card-foreground"
                    isMulti
                    cacheOptions
                    loadOptions={loadOptions}
                    defaultOptions
                    onChange={(selected) => field.onChange(selected.map(s => s.value))}
                  />
                </FormControl>
              </FormItem>
            )} />

            {/* Private/Public Toggle */}
            <FormField control={form.control} name="isPrivate" render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Private Group</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />

            <Button type="submit">Create Group</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
