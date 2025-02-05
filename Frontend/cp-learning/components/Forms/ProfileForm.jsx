"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";



import toast, { Toaster } from "react-hot-toast";
import { isValidUser } from "@/lib/codeforces";



const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  const { user } = useUser();
  const router = useRouter();


  const notify = () => toast.success("Verified");
  const notifyError = () => toast.error("Invalid User");

  async function onSubmit(values) {
    try {
      setLoading(true);
      console.log(values);
      const { username } = values;

      const result=await isValidUser(username);
      if(!result){
        notifyError();
        return;
      }

      const userId = user.id;
       
      const response = await axios.post("http://localhost:3000/api/user", {
        username,
        userId,
      });
      notify();
      console.log(response.data);
      router.push(`/${username}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-96 border-black border-2 p-5 rounded-md"
      >
        <Toaster/>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} disabled={loading} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
