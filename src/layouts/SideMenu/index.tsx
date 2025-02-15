import { Transition } from "react-transition-group";
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectSideMenu } from "../../stores/sideMenuSlice";
import { useAppSelector } from "../../stores/hooks";
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./side-menu";
import Lucide from "../../base-components/Lucide";
import clsx from "clsx";
import TopBar from "../../components/TopBar";
import MobileMenu from "../../components/MobileMenu";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import SideMenuTooltip from "../../components/SideMenuTooltip";
import Profile from "../../assets/images/fakers/profile-1.jpg";
import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import LoadingIcon from "../../base-components/LoadingIcon";
import Button from "../../base-components/Button";

interface LayoutProps {
  isDashboard: boolean;
}

// const DashbooardContent = () => {
//       return ( <div
//         className={clsx([
//           `max-w-full md:max-w-none  rounded-[30px] md:rounded-none  md:px-[22px] min-w-0 min-h-screen bg-secondary flex-1 md:pt-8 pb-10 mt-5 md:mt-1 relative dark:bg-darkmode-700`,
//           "before:content-[''] before:w-full before:h-px before:block",
//         ])}
//         >
//         <Outlet />
//         </div>)
// }

const Content = ({ dashboard }: { dashboard: boolean }) => {
  return dashboard ? (
    <div
      className={clsx([
        `max-w-full md:max-w-none  rounded-[30px] md:rounded-none  md:px-[22px] min-w-0 min-h-screen bg-secondary flex-1 md:pt-8 pb-10 mt-5 md:mt-1 relative dark:bg-darkmode-700`,
        "before:content-[''] before:w-full before:h-px before:block",
      ])}
    >
      <Outlet />
    </div>
  ) : (
    <div
      // className={clsx([
      //   `max-w-full md:max-w-none rounded-[30px] md:rounded-none md:px-[22px] min-w-0 min-h-screen bg-white flex-1 md:pt-8 pb-10 mt-5 md:mt-1 relative dark:bg-darkmode-800`,
      //   "before:content-[''] before:w-full before:h-px before:block",
      // ])}
      className={clsx([
        "max-w-full md:max-w-none rounded-[30px] md:rounded-none px-4 md:px-[28px] min-w-0 min-h-screen bg-primary flex-1 md:pt-4 pb-10 mt-5 md:mt-0 relative dark:bg-darkmode-700",
        "before:content-[''] before:w-full before:h-px before:block",
      ])}
    >
      <Outlet />
    </div>
  );
};

const Main: React.FC<LayoutProps> = ({ isDashboard }) => {
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | "divider">
  >([]);
  const sideMenuStore = useAppSelector(selectSideMenu);
  const sideMenu = () => nestedMenu(sideMenuStore, location);

  useEffect(() => {
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);

  const { user, userDispatch } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const history = useNavigate();

  useEffect(() => {
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);

  function logout() {
    setIsLoading(true);
    API("post", "logout", {}, onSuccess, onFail, user.token && user.token);
  }

  function onSuccess(data: any) {
    console.log(data);
    userDispatch({ type: "SIGNOUT" });
    setIsLoading(false);
    history("/login");
  }

  function onFail(error: string) {
    console.log(error);
    setIsLoading(false);
  }

  console.log(user);

  return (
    <div className="py-5 md:py-0">
      {/* <DarkModeSwitcher /> */}
      {/* <MainColorSwitcher /> */}
      <MobileMenu />
      <TopBar />
      <div className="flex overflow-hidden ">
        {/* BEGIN: Side Menu */}
        <nav className="w-[105px] lg:shadow-md shadow-slate-400 bg-white xl:w-[270px] px-5 pb-16 overflow-x-hidden z-50 pt-10 -mt-4 hidden md:block">
          <ul>
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              menu == "divider" ? (
                <Divider
                  type="li"
                  className={clsx([
                    "my-6",

                    // Animation
                    `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
                      (menuKey + 1) * 10
                    }`,
                  ])}
                  key={menuKey}
                ></Divider>
              ) : (
                <li key={menuKey}>
                  <Menu
                    className={clsx({
                      // Animation
                      [`opacity-0  translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                        (menuKey + 1) * 10
                      }`]: !menu.active,
                    })}
                    menu={menu}
                    
                    formattedMenuState={[formattedMenu, setFormattedMenu]}
                    level="first"
                  ></Menu>
                  {/* BEGIN: Second Child */}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={clsx([
                          "bg-white/[0.04] rounded-xl relative dark:bg-transparent",
                          "before:content-[''] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30",
                          { block: menu.activeDropdown },
                          { hidden: !menu.activeDropdown },
                        ])}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={subMenuKey}>
                            <Menu
                              className={clsx({
                                // Animation
                                [`opacity-0 translate-x-[50px]  animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                  (subMenuKey + 1) * 10
                                }`]: !subMenu.active,
                              })}
                              menu={subMenu}
                              formattedMenuState={[
                                formattedMenu,
                                setFormattedMenu,
                              ]}
                              level="second"
                            ></Menu>
                            {/* BEGIN: Third Child */}
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={clsx([
                                    "bg-white/[0.04] rounded-xl relative dark:bg-transparent",
                                    "before:content-[''] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30",
                                    { block: subMenu.activeDropdown },
                                    { hidden: !subMenu.activeDropdown },
                                  ])}
                                >
                                  {subMenu.subMenu.map(
                                    (lastSubMenu, lastSubMenuKey) => (
                                      <li key={lastSubMenuKey}>
                                        <Menu
                                          className={clsx({
                                            // Animation
                                            [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                              (lastSubMenuKey + 1) * 10
                                            }`]: !lastSubMenu.active,
                                          })}
                                          menu={lastSubMenu}
                                          formattedMenuState={[
                                            formattedMenu,
                                            setFormattedMenu,
                                          ]}
                                          level="third"
                                        ></Menu>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </Transition>
                            )}
                            {/* END: Third Child */}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
          </ul>

          {/* <div
            onClick={() => history(`/admin-profile`)}
            className="font-medium flex flex-col gap-y-2 xl:flex-row px-4 text-md cursor-pointer"
          >
            <img
              src={Profile}
              alt="Imge"
              className="w-8 h-8 rounded-full mr-2"
            />

            <div>
              <div className="font-medium">
                {user?.data?.firstName} {user?.data?.lastName}
              </div>
              <div className="text-xs  mt-0.5 dark:text-slate-500">
                Super Admin{" "}
              </div>
            </div>
          </div> */}
{/* 
          <div className="  py-3 border-b flex border-slate-200/60 dark:border-darkmode-400 mt-20">
            {isLoading ? (
              <div className="flex">
                <div className="flex flex-col items-center justify-center w-full">
                  <LoadingIcon icon="three-dots" className="w-8 h-8" />
                  <div className="mt-2 text-xs text-center">Loging out...</div>
                </div>
              </div>
            ) : (
              <div
                className="flex gap-x-4 items-center lg:px-4 cursor-pointer"
                onClick={logout}
              >
                <div>
                  <Lucide
                    icon="LogOut"
                    className="w-6 h-6 text-red-500 dark:red-500 "
                  />
                </div>
                <div className="text-md font-medium text-red-500">Log Out</div>
              </div>
            )}
          </div> */}
        </nav>

        {/* END: Side Menu */}
        {/* BEGIN: Content */}
        {
          // Content(isDashboard)
          <Content dashboard={isDashboard} />
        }
        {/* <div
          className={clsx([
            `max-w-full md:max-w-none  rounded-[30px] md:rounded-none  md:px-[22px] min-w-0 min-h-screen bg-secondary flex-1 md:pt-8 pb-10 mt-5 md:mt-1 relative dark:bg-darkmode-700`,
            "before:content-[''] before:w-full before:h-px before:block",
          ])}
        >
          <Outlet />
        </div> */}
        {/* END: Content */}
      </div>
    </div>
  );
};

function Menu(props: {
  className?: string;
  menu: FormattedMenu;
  formattedMenuState: [
    (FormattedMenu | "divider")[],
    Dispatch<SetStateAction<(FormattedMenu | "divider")[]>>
  ];
  level: "first" | "second" | "third";
}) {
  const navigate = useNavigate();
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState;

  return (
    <SideMenuTooltip
      as="a"
      content={props.menu.title}
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "h-[60px] text-m flex items-center pl-5 text-slate-600 mb-1 relative rounded-xl dark:text-slate-300",
        {
          " dark:text-slate-400 font-medium ": !props.menu.active && props.level != "first",
          "bg-customColor dark:bg-transparent ":
            props.menu.active && props.level == "first",
          "before:content-[''] before:block  before:inset-0 before:rounded-xl before:absolute before:border-b-[3px] before:border-solid before:border-black/[0.08] before:dark:border-black/[0.08] before:dark:bg-darkmode-700":
            props.menu.active && props.level == "first",
          "after:content-[''] after:w-[20px]  text-whiteafter:h-[80px] after:mr-[-27px] after:bg-menu-active after:bg-no-repeat after:bg-cover after:absolute after:top-0 after:bottom-0 after:right-0 after:my-auto after:dark:bg-menu-active-dark":
            props.menu.active && props.level == "first",
          "hover:bg-slate-100 hover:dark:bg-transparent hover:before:content-[''] hover:before:block hover:before:inset-0 hover:before:rounded-xl hover:before:absolute hover:before:z-[-1] hover:before:border-b-[3px] hover:before:border-solid hover:before:border-black/[0.08] hover:before:dark:bg-darkmode-700":
            !props.menu.active &&
            !props.menu.activeDropdown &&
            props.level == "first",

          // Animation
          "after:-mr-[47px] after:opacity-0 after:animate-[0.4s_ease-in-out_0.1s_active-side-menu-chevron] after:animate-fill-mode-forwards":
            props.menu.active && props.level == "first",
        },
        props.className,
      ])}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        linkTo(props.menu, navigate);
        setFormattedMenu([...formattedMenu]);
      }}
    >
      <div
        className={clsx({
          " text-white z-10 dark:text-slate-300":
            props.menu.active && props.level == "first",
          "text-white dark:text-slate-300":
            props.menu.active && props.level != "first",
          "dark:text-slate-400": !props.menu.active,
        })}
      >
        <Lucide icon={props.menu.icon} />
      </div>
      <div
        className={clsx([
          "w-full ml-3 hidden xl:flex items-center",
          {
            "text-white font-medium z-10 dark:text-slate-300":
              props.menu.active && props.level == "first",
            "text-slate-700 font-medium dark:text-slate-300":
              props.menu.active && props.level != "first",
            "dark:text-slate-400": !props.menu.active,
          },
        ])}
      >
        {props.menu.title}
        {props.menu.subMenu && (
          <div
            className={clsx([
              "transition ease-in duration-100 ml-auto mr-5 hidden xl:block",
              { "transform rotate-180": props.menu.activeDropdown },
            ])}
          >
            <Lucide className="w-4 h-4" icon="ChevronDown" />
          </div>
        )}
      </div>
    </SideMenuTooltip>
  );
}

function Divider<C extends React.ElementType>(
  props: { as?: C } & React.ComponentPropsWithoutRef<C>
) {
  const { className, ...computedProps } = props;
  const Component = props.as || "div";

  return (
    <Component
      {...computedProps}
      className={clsx([
        props.className,
        "w-full h-px bg-black/[0.06] z-10 relative dark:bg-white/[0.07]",
      ])}
    ></Component>
  );
}

export default Main;
