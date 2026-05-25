import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    isLoading: false,
    error: false,
    searchTerm: '',
    commentsByPostId: {},
    loadingComments: {},
    afterId: null, // Track the next page
}

const redditSlice = createSlice({
    name: 'reddit',
    initialState,
    reducers: {
        startFetchPosts: (state) => {
            state.isLoading = true;
            state.error = false;
        },
        fetchPostsSuccess: (state, action) => {
            state.isLoading = false;
            state.error = false;
            
            // Destructure the data object coming from your actions file
            const { posts, afterId } = action.payload;
            
            if (Array.isArray(posts)) {
                state.posts = [...state.posts, ...posts];
            }
            state.afterId = afterId;
        },
        fetchPostsFailure: (state) => {
            state.isLoading = false;
            state.error = true;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload
        },
        togglePostLike: (state, action) => {
            const post = state.posts.find(p => p.id === action.payload);
            if(post) {
                post.isLiked = !post.isLiked;
            }
        },
         startFetchComments: (state, action) => {
            state.loadingComments[action.payload] = true;
        },
        fetchCommentsSuccess: (state, action) => {
            const { postId, comments } = action.payload;
            state.loadingComments[postId] = false;
            state.commentsByPostId[postId] = comments;
         },
        fetchCommentsFailure: (state, action) => {
             state.loadingComments[action.payload] = false;
        },
    }
})

export const {
    startFetchPosts,
    startFetchComments,
    fetchPostsSuccess,
    fetchCommentsSuccess,
    fetchPostsFailure,
    fetchCommentsFailure,
    setSearchTerm,
    togglePostLike,
} = redditSlice.actions;

export default redditSlice.reducer;