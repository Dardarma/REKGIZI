import { authApi } from '@/utils/baseURL'

export interface DashboardPeriod {
  month: number
  year: number
}

export const getTotalInformation = async (period: DashboardPeriod) => {
  const res = await authApi.get(`/api/v1/ahligizi/dashboard/total`, { params: period })
  return res.data
}

export const getRekamPasienDashboard = async (period: DashboardPeriod) => {
  const res = await authApi.get(`/api/v1/ahligizi/dashboard/rekam_pasien`, { params: period })
  return res.data
}

export const getPersebaranKasusDiet = async (period: DashboardPeriod) => {
  const res = await authApi.get(`/api/v1/ahligizi/dashboard/persebaran_kasus`, { params: period })
  return res.data
}

export const getPersebaranMingguan = async (period: DashboardPeriod) => {
  const res = await authApi.get(`/api/v1/ahligizi/dashboard/persebaran_minggu`, { params: period })
  return res.data
}

export const getPersebaranUsia = async (period: DashboardPeriod) => {
  const res = await authApi.get(`/api/v1/ahligizi/dashboard/persebaran_usia`, { params: period })
  return res.data
}

