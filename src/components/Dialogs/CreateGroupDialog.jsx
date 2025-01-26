import React, { useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { setIsCreateGroup } from "@/redux/reducers/misc";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import UserAvatar from "@/assets/userAvatar.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera } from "lucide-react";
import axios from "axios";
import { data } from "autoprefixer";
import { server } from "@/constant/config";

const formSchema = z.object({
  groupname: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  })
});

const CreateGroupDialog = () => {
  const { isCreateGroup } = useSelector((state) => state.misc);
  const [fileAvatar, setFileAvatar] = useState(null);
  const [Error, setError] = useState(null);
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  // 1. Define your form.
  const ImageRef = useRef(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver<z.infer<typeof formSchema>>(formSchema),
    defaultValues: {
      groupname: "Enter name here ",
      groupImage: null,
      isPrivate: false,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values) {
    console.log("values", values);
    const formData = new FormData();
    formData.append("groupName", values.groupname);
    formData.append("avatar", values.groupImage);
    formData.append("groupType", values.isPrivate ? "private" : "public");
    console.log(formData.get("groupName"));
    startTransition(async () => {
      try {
        const response = await axios.post(
          `${server}/api/v1/group/new`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "multipart/form-data",
            },
          }
        );
        // console.log(group.data)
        if (response.data.success === true) {
          setFileAvatar(null);
          form.reset();
          dispatch(setIsCreateGroup(false));
        }
        if (response.data.success === false) {
          setError(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  return (
    <Dialog
      open={isCreateGroup}
      onOpenChange={() => dispatch(setIsCreateGroup(false))}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create Group</DialogTitle>
          <DialogDescription className="text-primary text-center">
            create groups instantly and invite friends
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="groupImage"
                render={({ field }) => (
                  <FormItem className="flex justify-center items-center">
                    <FormControl>
                      <div
                        onClick={() => ImageRef.current.click()}
                        className=" relative w-20 h-20 rounded-full flex justify-center items-center"
                      >
                        <Avatar className="h-20 w-20 object-cover">
                          <AvatarImage src={fileAvatar} />
                          <AvatarFallback>{"G"}</AvatarFallback>
                        </Avatar>
                        <Camera
                          className={`${
                            false && "hidden"
                          }block absolute top-6 right-6`}
                          fill="blue"
                          size={30}
                        />
                        <input
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            // console.log(file)
                            if (file) setFileAvatar(URL.createObjectURL(file));
                            field.onChange(file);
                          }}
                          ref={ImageRef}
                          className="hidden"
                          type="file"
                        ></input>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groupname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="enter name here"
                        type="text"
                        //   disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Private Group</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        className="ml-3"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
