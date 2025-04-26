import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";
import { Menu, Popover } from "../base-components/Headless";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "LayoutDashboardIcon",
      pathname: "/dashboard",
      title: "Dashboard",

    
    },

    {
      icon: "BarChart2Icon",
      title: "Campaigns",
      subMenu: [
        {
          icon: "ShoppingBagIcon",
          pathname: "/orders",
          title: "Orders",
        },
    
      
        // {
        //   icon: "CalendarIcon",
        //   pathname: "#",
        //   title: "Calendar",    
        // },
     
        {
          icon: "TruckIcon",
          pathname: "/delivered-campaigns",
          title: "Delivered",
        },
      ],
    },

    {
      icon: "UserCircleIcon",
      pathname: "/clients",
      title: "Client",

    },


    {
      icon: "Signpost",
      pathname: "/billboards",
      title: "Billboards",

    },
    {
      icon: "WalletIcon",
      pathname: "/finance",
      title: "Finance",

    },

    {
      icon: "UsersIcon",
      pathname: "/users",
      title: "Users",

    },

    {
      icon: "ShieldCheckIcon",
      pathname: "/role-management",
      title: "Role Management",

    },


 

    // {
    //   icon: "Users",
    //   title: "Users",
    //   subMenu: [
    //     {
    //       icon: "User",
    //       pathname: "/users",
    //       title: "All Users",
    //     },
    //     // {
    //     //   icon: "User",
    //     //   pathname: "/add-user",
    //     //   title: "Add new User",
    //     // },
    //     {
    //       icon: "User",
    //       pathname: "#",
    //       title: "Attendance",
    //     },
    //     {
    //       icon: "User",
    //       pathname: "#",
    //       title: "Performance",
    //     },
    //     {
    //       icon: "User",
    //       pathname: "/role-management",
    //       title: "Role Management",
    //     },
    //   ],
    // },
    // {
    //   icon: "Lock",
    //   title: "Security",
   
    // },

    "divider",

  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;


