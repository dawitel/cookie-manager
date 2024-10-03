"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CookieManager from "@/components/fileupload";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ModeToggle } from "@/components/theme-toggle";
import { UserButton } from "@/components/user-button";
import * as CryptoJS from "crypto-js";
import axios from "axios";

// Function to encrypt data
const encryptData = (cookie: string, secretKey: string): string => {
  if (!secretKey) {
    throw new Error("Secret key is missing!");
  }
  return CryptoJS.AES.encrypt(cookie, secretKey).toString();
};

export default function Dashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Function to check user authentication
    const checkAuth = async () => {
      const res = await fetch("/api/v1/auth/check", {
        method: "GET",
        credentials: "include",
      });

      if (res.status !== 200) {
        router.push("/"); // Redirect if not logged in
      }
    };

    checkAuth();
  }, [router]);

  // Function to handle cookie upload
  const handleCookieUpload = async (cookie: string, site: string) => {
    const secretKey = "tejnV4PrHwKAimU3dZINFzOKxrO1OT/tSg7r8hc"; // Fetch the secret key securely
    if (secretKey == undefined) {
      console.error("Secret key is missing.");
      toast({
        variant: "destructive",
        title: "Encryption error",
        description:
          "Encryption key is missing. Please add it to the environment variables",
      });
      return; // Exit the function if the key is missing
    }
    const encryptedCookie = encryptData(cookie, secretKey);
    console.log(encryptedCookie);
    setIsLoading(true);

    const body = {
      cookieText: encryptedCookie,
      site: site,
    };

    try {
      const response = await axios.post("/api/v1/update", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 200) {
        toast({
          variant: "success",
          title: "Cookies updated successfully",
          description: "Your site cookies have been updated.",
          action: <ToastAction altText="success button">Cancel</ToastAction>,
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Invalid cookie data",
          description: "Please upload valid cookie information.",
          action: <ToastAction altText="retry">Try again</ToastAction>,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to upload cookies",
        description: "Please try uploading the cookie data again.",
        action: <ToastAction altText="retry">Try again</ToastAction>,
      });
      console.error("Error uploading cookie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <div className="absolute top-0 gap-x-3 flex left-0 p-10">
          <UserButton />
          <ModeToggle />
        </div>

        <h1 className="font-sans text-balance dark:bg-gray-900 rounded-xl shadow-2xl px-4 dark:hover:shadow-2xl py-5 font-black text-3xl sm:text-5xl md:text-6xl lg:text-6xl">
          Manage your sites&apos; cookies from one place{" "}
          <span className="cursor-pointer hover:translate-y-3 rounded-md hover:shadow-2xl">
            📁
          </span>
        </h1>

        <p className="max-w-[42rem] mt-5 leading-normal mb-5 text-muted-foreground sm:text-xl sm:leading-8">
          Select the site you want to update, add the cookie for the site in the
          input box below, and click update cookies.
        </p>

        <div className="w-1/2">
          <CookieManager
            onFileUpload={handleCookieUpload}
            btnText={isLoading ? "Updating..." : "Update cookies"}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}
