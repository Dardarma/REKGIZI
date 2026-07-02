import {
  home,
  calender,
  stethoscope,
  newspapper,
} 
from "@/icons/customeIcon";

export const userMenuGroups = [
  {
    title: "Menu",
    items: [
      {
        icon: home,
        name: "Dashboard",
        path: "/user",
      },
      {
        icon: stethoscope,
        name: "Rekam Medis",
        path: "/user/rekam-medis",
      },
      
      {
        icon: calender,
        name: "Jadwal Temu",  
        path: "/user/janji-temu",
      },
      {
        icon: newspapper,
        name: "Artikel",
        path: "/user/article",
      }
    ],
  },
];
