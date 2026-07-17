"use client";

import { Card } from "@/designs/card/Card";
import { CheckBoxInput, Textinput } from "@/designs/inputs/InputComponents";
import useHandleinpute from "@/hooks/useHandleInpute";
import { InputOption } from "@/types/Input";
import { type wish } from "../types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { SelectionInput } from "@/designs/inputs";
import { FileUpload } from "@/components/ui/file-upload";

let loginOptions: InputOption[] = [
  {
    id: "1",
    inputId: "input-title",
    placeholder: "Enter full title",
    required: true,
    name: "title",
  },
  {
    id: "2",
    inputId: "input-description",
    placeholder: "Enter description",
    required: true,
    name: "description",
  },
  {
    id: "3",
    inputId: "input-to",
    placeholder: "Enter to",
    required: true,
    name: "to",
  },
  {
    id: "4",
    inputId: "input-date",
    placeholder: "Enter date",
    required: true,
    name: "date",
  },
];

export default function WishCreatePage() {
  let { value, handleInputefn } = useHandleinpute<wish>({
    id: "",
    title: "",
    description: "",
    to: "",
    date: "",
    messages: [""],
    images: [""],
  });

  const [isimageStr, setImageStr] = useState<Boolean>(true);

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const CreateNewWish = () => {
    let response = true;

    if (response) {
      toast.success("wish created successfully");
    } else {
      toast.error("wish not created ");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[85vh] w-full p-4">
        <Card className="inputCont w-max flex-col p-8 rounded-lg">
          <div className="gap-2 flex-col flex">
            <h2 className="text-center font-bold capitalize  text-primary ">
              Create A New Wish
            </h2>
            <Textinput
              containerClass="w-[30vw] "
              options={loginOptions}
              handleInputefn={handleInputefn}
              value={value}
            />

            <CheckBoxInput
              text="Do you want to upload image ?"
              onCheckedChange={setImageStr}
              Check={isimageStr}
            />
            {isimageStr ? (
              <>
                <div className=" w-full  h-40  border border-dashed rounded-lg">
                  <FileUpload onChange={handleFileUpload}   />
                </div>
              </>
            ) : (
              <></>
            )}
            <Button onClick={CreateNewWish}>Create</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
