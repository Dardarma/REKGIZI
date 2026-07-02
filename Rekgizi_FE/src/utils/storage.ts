import Cookies from "js-cookie"

export const setCookies = (token: string)=> {
  if (token) {
    Cookies.set("token", token)
  }
}

export const setInformation = (data: any) => {
  localStorage.setItem("id",data.id)
  localStorage.setItem("name", data.nama)
  localStorage.setItem("role", data.role)
}