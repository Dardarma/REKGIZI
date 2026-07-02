import {
  home,
  stethoscope,
  eye,
} 
from "@/icons/customeIcon";
import { 
  PlusIcon, 
} from "@/icons";


export const nakesMenuGroup = [
  {
    title: "Menu",
    items: [
      {
        icon: home,
        name: "Home",
        path: "/ahligizi"
      },
      {
        icon : stethoscope,
        name : "Diagnosa",
        subItems :[
          { name: "Diagnosa Baru", icon: PlusIcon, path: "/ahligizi/diagnosa/create", pro: false },
          { name: "Riview Diagnosa", icon: eye, path: "/ahligizi/diagnosa/review", pro: false },
        ]
      },
    ],
  },
]
