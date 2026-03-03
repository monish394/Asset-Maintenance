import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../config/api"

export const fetchAllGeneralRequest = createAsyncThunk("GeneralRequest/fetchAllGeneralRequest", async () => {
    try {
        const response = await axios.get("/getallgeneralrequest")
        return response.data
    }
    catch (error) {
        return error.response.data
    }
})

const GeneralRequestSlice = createSlice({
    name: "GeneralRequest",
    initialState: {
        data: [],
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllGeneralRequest.fulfilled, (state, action) => {
            state.data = action.payload
        })
        builder.addCase(fetchAllGeneralRequest.rejected, (state, action) => {
            state.error = action.payload
        })
    }
})


export default GeneralRequestSlice.reducer
