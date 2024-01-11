import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { StatsResponse } from "../../types/api-types"

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`
    }),
    endpoints: (builder) => ({
        stats: builder.query<StatsResponse, string>({
            query: (id) => `stats?id=${id}`,
            keepUnusedDataFor: 0 
        })
    })
})

export const { useStatsQuery } = dashboardApi