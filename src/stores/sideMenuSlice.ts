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
      icon: "LayoutDashboard",
      pathname: "/dashboard",
      title: "Dashboard",

    
    },

    {
      icon: "Book",
      title: "Campaigns",
      subMenu: [
        {
          icon: "Book",
          pathname: "/orders",
          title: "Orders",
        },
    
      
        {
          icon: "Book",
          pathname: "#",
          title: "Calendar",    
        },
     
        {
          icon: "Book",
          pathname: "/running-campaigns",
          title: "Delivered",
        },
      ],
    },

    {
      icon: "Users",
      pathname: "/clients",
      title: "Client",

    },


    {
      icon: "Tv2",
      pathname: "/billboards",
      title: "Billboards",

    },
    {
      icon: "DollarSign",
      pathname: "/finance",
      title: "Finance",

    },

    {
      icon: "User",
      pathname: "/users",
      title: "Users",

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
