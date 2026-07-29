"use client";

import { ThemeToggler } from "@/designs/theme/index";
import { Button } from "@/components/ui/button";
import NavLink from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const Header = ({
  LogoUrl,
  BrandName,
}: {
  LogoUrl: string;
  BrandName?: string;
}) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Check local storage for session info on mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wishey_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("wishey_user");
    }
    setCurrentUser(null);
    toast.success("Successfully logged out.");
    router.push("/");
    router.refresh();
  };

  return (
    <nav className=" header  top-0 right-0 left-0   h-20 max-w-full z-8">
      <div className=" flex  gap-2 md:gap-4 items-center justify-between p-2 md:mx-10 h-full  ">
        <NavLink href="/" className="h-fit gap-3 flex items-center group cursor-pointer">
          <Image
            className="transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
            src={LogoUrl}
            alt="Wishey Logo"
            width={44}
            height={44}
            priority
          />

          <div className="flex-col justify-start flex">
            <p className="md:whitespace-nowrap text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight">
              {BrandName}
            </p>
            <p className="md:whitespace-nowrap text-xs text-muted-foreground font-medium">
              wish your close ones..
            </p>
          </div>
        </NavLink>

        <div className="button_section flex h-fit gap-1 md:gap-4 ">
          <NavLink href={"/"}>
            <Button className=" ">home</Button>
          </NavLink>
          <NavLink href={"/wish/list"}>
            <Button className=" ">wish</Button>
          </NavLink>
          {currentUser?.role === "admin" && (
            <NavLink href={"/admin"}>
              <Button className="bg-red-500 hover:bg-red-600 text-white border-0 font-semibold">
                Admin Panel
              </Button>
            </NavLink>
          )}
        </div>
        <div className="button_section flex h-fit gap-1 md:gap-4 items-center">
          {/* <div className="currency">
            <Suspense fallback={<LoaderFive text="loading ..."/>}></Suspense>
          </div> */}
          <ThemeToggler />
          {currentUser ? (
            <div className="flex gap-3 items-center">
              <span className="text-xs text-muted-foreground font-semibold hidden md:inline">
                Welcome,{" "}
                <strong className="text-foreground">{currentUser.name}</strong>
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <NavLink href={"/signup"}>
                <Button className=" ">Sign up</Button>
              </NavLink>
              <NavLink href={"/login"}>
                <Button color="blue">Login</Button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Header;

// export const Logo = ({
//   url
// }: {
//   url: string;
// }) => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const { api } = useApi()

//   let { islogin, name, email } = useAppSelector(
//     (state) => state.user
//   );

//   const userLogout = async () => {
//     if (islogin) {
//       dispatch(logout());
//       let response = await api.user.userLogout()

//       if (
//         response.success
//       ) {
//         toast.success(response.message, ToastConfig());
//         console.log("removed  cached.."),
//           navigate("/login")
//       } else {
//         toast.info("processing", ToastConfig());
//         window.location.reload();
//       }
//     }
//   };

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <div>
//             <Avatar_one url={url} />
//           </div>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuLabel>
//             <span
//               className="block text-sm text-[var(--text-primary)] "
//               onClick={() => navigate("/user/profile")}
//             >
//               {name}
//             </span>
//             <span className="block truncate text-sm font-medium">{email}</span>
//           </DropdownMenuLabel>
//           <DropdownMenuLabel onClick={() => navigate("/home")}>
//             Home
//           </DropdownMenuLabel>
//           <DropdownMenuLabel onClick={() => navigate("/user/profile")}>
//             Profile
//           </DropdownMenuLabel>
//           <DropdownMenuLabel onClick={() => navigate("/user/balance")}>
//             Balance
//           </DropdownMenuLabel>
//           <DropdownMenuLabel onClick={() => navigate("/user/activityhistory")}>
//             Activity History
//           </DropdownMenuLabel>
//           <DropdownMenuLabel onClick={() => navigate("/user/validation")}>
//             Validation
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuLabel onClick={userLogout}>Sign out</DropdownMenuLabel>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// };
