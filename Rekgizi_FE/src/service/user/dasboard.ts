import { authApi } from "@/utils/baseURL";

export async function getJanjiTemu() {
    const res = await authApi(`/api/v1/user/dashboard/jadwal`)
    return res.data
}

export async function getIntervensi(){
    const res = await authApi(`/api/v1/user/dashboard/intervensi`)
    return res.data
}