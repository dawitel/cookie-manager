import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { ToastAction } from "@radix-ui/react-toast";
import { UploadIcon } from "@radix-ui/react-icons";
import { Textarea } from "./ui/textarea";
import { WebsiteDropdown } from "./web-dropdown";
import { SupportedSites } from "@/types/supported-sites";

interface CookieManagerProps {
  onFileUpload: (cookietext: string, site: string) => void;
  btnText: string;
  isLoading: boolean;
}

const CookieManager: React.FC<CookieManagerProps> = ({
  onFileUpload,
  btnText,
  isLoading,
}) => {
  const { toast } = useToast();
  const [cookie, setCookie] = useState<string>("");
  const [site, setSite] = useState<string>("");
  const [errors, setErrors] = useState<{ cookie?: string; site?: string }>({});

  const validateFields = () => {
    const fieldErrors: { cookie?: string; site?: string } = {};
    if (!cookie) fieldErrors.cookie = "Cookie is required";
    if (!site) fieldErrors.site = "Site is required";
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleUploadClick = () => {
    if (validateFields()) {
      onFileUpload(cookie, site);
    } else {
      toast({
        variant: "destructive",
        title: "Please complete all fields!",
        description: "You need to fill all fields correctly",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };


  return (
    <div className="bg-blue-100 dark:bg-gray-600 rounded-xl p-6">
      <div className="flex flex-col items-center gap-4">
        <Textarea
          required
          value={cookie}
          onChange={(e) => setCookie(e.target.value)}
          className="bg-white py-2 h-40 text-slate-900 dark:placeholder:text-black"
          placeholder="Place the cookie data here"
        />
        {errors.cookie && (
          <p className="text-red-500 text-xs">{errors.cookie}</p>
        )}

        <div className="flex gap-4 w-full">
          <div className="">
            <WebsiteDropdown websites={SupportedSites} onSelect={setSite} />
            {errors.site && (
              <p className="text-red-500 text-xs">{errors.site}</p>
            )}
          </div>

          <Button
            onClick={handleUploadClick}
            className="flex-1 bg-blue-500 dark:bg-blue-800 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center"
            disabled={isLoading}
          >
            <UploadIcon className="mr-2" />
            <span>{btnText}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieManager;
