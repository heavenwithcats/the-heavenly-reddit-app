import { configureStore } from "@reduxjs/toolkit";
import redditReducer from './redditSlice';

const store = configureStore({
    reducer: {
        
            reddit: redditReducer,
        
    }
})