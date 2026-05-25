import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import {
    startFetchPosts,
    startFetchComments,
    fetchPostsSuccess,
    fetchCommentsSuccess,
    fetchPostsFailure,
    fetchCommentsFailure
} from '../store/redditSlice';

export const fetchRedditPosts = () => async (dispatch, getState) => {
    const { isLoading, afterId } = getState().reddit;
    if (isLoading) return;

    try {
        dispatch(startFetchPosts());

        const proxyUrl = 'https://corsproxy.io/?';
        let targetUrl = 'https://www.reddit.com/r/StarWars/hot.json?limit=25';
    
        if (afterId) {
            targetUrl += `&after=${afterId}`;
        }
        
        const response = await axios.get(proxyUrl + encodeURIComponent(targetUrl));
        const data = response.data.data;
        const children = data.children;

        // Map over all incoming posts to make sure your array isn't left empty
        const formattedPosts = children.map((item) => {
            const p = item.data;
            const postDate = new Date(p.created_utc * 1000);
            const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
            const postImage = p.url_overridden_by_dest || p.url || p.thumbnail;

            return {
                id: p.id,
                title: p.title,
                author: p.author,
                score: p.score, 
                permalink: p.permalink,
                image: postImage,
                timeAgo: timeAgo,
                isLiked: false,
            };
        });

        // Dispatching the exact structure the slice expects
        dispatch(fetchPostsSuccess({
            posts: formattedPosts,
            afterId: data.after
        }));
    } catch (error) {
        console.error("Vader cut your server up:", error);
        dispatch(fetchPostsFailure());
    }
};

export const fetchPostComments = (postId, permalink) => async (dispatch) => {
    try {
        dispatch(startFetchComments());
        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = `https://www.reddit.com${permalink}.json`;
        const response = await axios.get(proxyUrl + encodeURIComponent(targetUrl));
        const commentChildren = response.data[1].data.children;

        const formattedComments = commentChildren.slice(0, 10).map((c) => ({
            id: c.data.id,
            author: c.data.author,
            body: c.data.body,
        }));
        
        dispatch(fetchCommentsSuccess({ postId, comments: formattedComments }));
       
    } catch (error) {
        console.error("Failed to get comments from holonet:", error);
        dispatch(fetchCommentsFailure(postId));
    }
};