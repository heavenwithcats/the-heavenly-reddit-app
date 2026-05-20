import { createSlice } from "@reduxjs/toolkit";

const savedLikes = JSON.parse(localStorage.getItem('userLikes'))

const likesSlice = createSlice({
name: 'likes',
initialState: {
    likedPosts: savedLikes,
},
reducers: {
    toggleLike: (state, action) => {
    const postId = action.payload;
    state.likedPosts[postId] = !state.likedPosts[postId];
    localStorage.setItem('userLikes', JSON.stringify(state.likedPosts))
},
 },
});
 
export const { toggleLike } = likesSlice.actions;
export default likesSlice.reducer;