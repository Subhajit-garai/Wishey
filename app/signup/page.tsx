"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/designs/card";
import { Textinput } from "@/designs/inputs";
import useHandleinpute from "@/hooks/useHandleInpute";
import { ApiClient } from "@/lib/apiclient";
import { InputOption } from "@/types";
import Link from "next/link";
import { toast } from "sonner";


let loginOptions: InputOption[] = [
  {
    id: "1",
    inputId: "input-name",
    placeholder: "Enter full name",
    required: true,
    name: "name",
  },
  {
    id: "2",
    inputId: "input-email",
    placeholder: "Enter Email",
    required: true,
    name: "email",
  },
  {
    id: "4",
    inputId: "input-password",
    placeholder: "Enter password",
    required: true,
    name: "password",

  },
];


export default function Signup() {


   let { value, handleInputefn } = useHandleinpute({
    name: "",
    email: "",
    password: "",
  });


  const signupfn = async () => {
    let response = await  ApiClient.getInstance().request("/signup", {
      method: "POST",
      data: {
        email: value.email,
        name: value.name,
        password: value.password
      }
    });
    if (response.success) {
      toast.success(response.message);

      // navigate("/login", { replace: true });
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[85vh] w-full p-4">
        <Card className="inputCont w-fit flex-col p-8 rounded-lg">
          <div className="gap-2 flex-col flex">
            <h2 className="text-center font-bold capitalize  text-primary ">
              Sign up now
            </h2>
            <Textinput
              options={loginOptions}
              handleInputefn={handleInputefn}
              value={value}
            />
            <Link href={"/login"}>
              <p className=" underline font-bold text-sm text-muted-foreground text-center hover:text-blue-500">
                or log in
              </p>
            </Link>
            {/* <Link><p className=" underline font-bold text-sm text-muted-foreground">forgot password</p></Link> */}
          </div>
          <div className="btc mt-4 w-full flex justify-center">
            <Button color="blue" onClick={signupfn}>
              Sign up
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
