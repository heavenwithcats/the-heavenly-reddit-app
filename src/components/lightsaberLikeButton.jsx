import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLike } from '../features/likesSlice';
import { hiltImage } from './lightsaber-like-inactive.png'
import { lightsaberImage } from './lightsaber-like.png'

const LikeButton = ({ lightsaberImage, hiltImage }) => {
    const isLiked = useSelector((state) => state.likes.likedPosts[postId]);
    const handleToggle = () => {
        dispatch(toggleLike(postId))
    };

   return (
    <button
    onClick={handleToggle}
    style={{ background: 'none', border: 'none', cursor: 'pointer'}}
    >
     <img 
     src={isLiked ? lightsaberImage : hiltImage}
     alt="Lightsaber Like Button"
     style={{width: '24px', height: '24px'}}
     />   
    </button>
   )
}

export default LikeButton;