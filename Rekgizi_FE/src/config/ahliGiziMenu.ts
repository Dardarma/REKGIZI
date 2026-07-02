import {
  home,
  calender,
  stethoscope,
  eye,
  newspapper,
  utensil
} 
from "@/icons/customeIcon";
import { 
  PlusIcon, 
  ArchiveIcon,
  TaskIcon
} from "@/icons";
import ListIcon from "@/icons/ListIcon.vue";


export const ahliGiziMenuGroup = [
  {
    title: "Menu",
    items: [
      {
        icon: home,
        name: "Home",
        path: "/ahligizi"
      },
      {
        icon: calender,
        name: "Calender",
        
      },
      {
        icon : stethoscope,
        name : "Asuhan",
        subItems :[
          { name: "Asuhan Baru", icon: PlusIcon, path: "/ahligizi/diagnosa/create", pro: false },
          { name: "Review Asuhan", icon: eye, path: "/ahligizi/diagnosa/edit", pro: false },
        ]
      },
      {
        icon : newspapper,
        name : "Artikel",
        path : "/ahligizi/artikel"
      },
      {
        icon : ArchiveIcon,
        name : "Master Data",
        subItems : [
          { name: "Parameter", icon:TaskIcon, path: "/ahligizi/master/parameter", pro: false },
          { name: "intervensi", icon:utensil, path: "/ahligizi/master/intervensi", pro: false },
          { name: "Diagnosa", icon:stethoscope, path: "/ahligizi/master/diagnosa", pro: false },
        ]
      },
       {
        icon : calender,
        name : "Janji Temu",
        subItems : [
          { name: "Buat Jadwal", icon:ListIcon, path: "/ahligizi/janji-temu/jadwal", pro: false },
          { name: "Buat Janji temu", icon:calender, path: "/ahligizi/janji-temu/janji_temu", pro: false },
        ]
      }
    ],
  },
]
