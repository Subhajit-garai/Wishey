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
    inputId: "input-email",
    placeholder: "Enter Email",
    required: true,
    name: "email",
  },
  {
    id: "2",
    inputId: "input-password",
    placeholder: "Enter password",
    required: true,
    name: "password",

  },
];


import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

   let { value, handleInputefn } = useHandleinpute({
    name: "",
    email: "",
    password: "",
  });


  const loginfn = async () => {
    let response = await  ApiClient.getInstance().request("/login", {
      method: "POST",
      data: {
        email: value.email,
        password: value.password
      }
    });
    if (response.success) {
      toast.success(response.message);
      
      // Save session info locally
      if (typeof window !== "undefined" && response.data) {
        localStorage.setItem("wishey_user", JSON.stringify(response.data));
      }

      if (response.data?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[85vh] w-full p-4">
        <Card className="inputCont w-full max-w-md flex-col p-6 sm:p-8 rounded-2xl shadow-xl border border-border/60">
          <div className="gap-3 flex-col flex">
            <h2 className="text-center font-extrabold text-2xl capitalize text-primary">
              Log in now
            </h2>
            <Textinput
              options={loginOptions}
              handleInputefn={handleInputefn}
              value={value}
            />
            <Link href={"/signup"}>
              <p className="underline font-bold text-sm text-muted-foreground text-center hover:text-primary transition-colors">
                or Sign up for an account
              </p>
            </Link>
          </div>
          <div className="btc mt-6 w-full flex justify-center">
            <Button className="w-full font-bold shadow-md" onClick={loginfn}>
              Log in
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
