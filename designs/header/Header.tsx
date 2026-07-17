import { ThemeToggler } from "@/designs/theme/index";
import { Button } from "@/components/ui/button";
import NavLink from "next/link";
import Image from "next/image";

export const Header = ({
  LogoUrl,
  BrandName,
}: {
  LogoUrl: string;
  BrandName?: string;
}) => {
  let islogin = false;

  return (
    <nav className=" header  top-0 right-0 left-0   h-20 max-w-full z-8">
      <div className=" flex  gap-2 md:gap-4 items-center justify-between p-2 md:mx-10 h-full  ">
        <div className="h-fit  gap-2  flex ">
          {/* <Logo url={LogoUrl} /> */}
          <Image className="" src={LogoUrl} alt="Logo" width={40} height={40} />

          <div className="flex-col justify-start gap-1 flex">
            <p className=" self md:whitespace-nowrap   md:text-xl font-semibold text-(--text-primary)  ">
              {BrandName}
            </p>
            <p className=" self md:whitespace-nowrap  text-sm  text-accent  ">
              wish your close ones..
            </p>
          </div>
        </div>

        <div className="button_section flex h-fit gap-1 md:gap-4 ">
          <NavLink href={"/"}>
            <Button className=" ">home</Button>
          </NavLink>
          <NavLink href={"/wish"}>
            <Button className=" ">wish</Button>
          </NavLink>
        </div>
        <div className="button_section flex h-fit gap-1 md:gap-4 ">
          {/* <div className="currency">
            <Suspense fallback={<LoaderFive text="loading ..."/>}></Suspense>
          </div> */}
          <ThemeToggler />
          {!islogin && (
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
