import { configureStore } from "@reduxjs/toolkit";
import GeneralRequestSlice from "../slices/generalrequestslices";


const store=configureStore({
    reducer:{
        GeneralRequest:GeneralRequestSlice
        
    }
})

export default store
