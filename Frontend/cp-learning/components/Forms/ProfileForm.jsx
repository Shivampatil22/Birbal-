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
      const { username } = values;

      const result = await isValidUser(username);
      if (!result) {
        notifyError();
        return;
      }

      const userId = user.id;
      const response = await axios.post("https://birbal-nine.vercel.app/api/user", {
        username,
        userId,
      });

      notify();
      router.push(`/profile/you`);
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
        className="space-y-8 w-96 bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-md"
      >
        <Toaster />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Username</FormLabel>
              <FormControl>
                <Input
                  className="bg-[#2a2a2a] text-white placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your Codeforces username"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                This is your public display name.
              </FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
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
