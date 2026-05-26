import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedditPosts, fetchPostComments } from './store/redditActions';
import { togglePostLike, setSearchTerm, changeCategory } from './store/redditSlice';
import { label } from 'framer-motion/client';

function App() {
  const dispatch = useDispatch();
  
  const categories = [
{ label: 'All Star Wars', value: 'StarWars', src: '/all-star-wars.jpg' },
  { label: 'The Mandalorian', value: 'TheMandalorian', src: '/the-mandalorian.jpg' },
  { label: 'Star Wars Lore', value: 'StarWarsLore', src: '/star-wars-lore.jpg' },
  { label: 'Lego Star Wars', value: 'legostarwars', src: '/lego-star-wars.jpg' }
  ]

  // Grab our centralized data states from the Redux store
  const { posts, isLoading, error, searchTerm, commentsByPostId, loadingComments } = useSelector((state) => state.reddit);
  
  // Local states for tracking unravelled comments and your typing input
  const [openCommentId, setOpenCommentId] = useState(null);
  const [localSearch, setLocalSearch] = useState('');

  // INFINITE SCROLL LISTENER
  useEffect(() => {
    dispatch(fetchRedditPosts());

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        console.log('Reaching into other galaxies far far away....');
        dispatch(fetchRedditPosts());
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Correctly removes the event listener when clearing memory!
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  // Handle clicking your custom comment button
  const handleCommentClick = (postId, permalink) => {
    if (openCommentId === postId) {
      setOpenCommentId(null);
    } else {
      setOpenCommentId(postId);
      if (!commentsByPostId[postId]) {
        dispatch(fetchPostComments(postId, permalink));
      }
    }
  };

  // Trigger search when your custom button is clicked
  const handleSearchSubmit = () => {
    dispatch(setSearchTerm(localSearch));
  };

  // Filter posts based on the submitted search term (With safety protection!)
  const filteredPosts = posts.filter((post) => 
    post && post.title ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );

  // --- INTERFACE SCREEN A: THE DARTH VADER NETWORK FAILURE FALLBACK ---
  if (error) {
    return (
      <div className="App">
        <div className="error-state">
          <img className="image" src="/darth-unavailable.jpg" alt="darth vader" />
          <br />
          <p className="teko">
            Sorry, couldn't load this information because Darth Vader has cut up your server. 
            Please check your internet connection and try again.
          </p>
          <button 
            onClick={() => dispatch(fetchRedditPosts())} 
            className="buttons" 
            style={{ color: 'white', marginTop: '15px', padding: '5px 15px', cursor: 'pointer' }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // --- INTERFACE SCREEN B: THE MAIN LIVE STAR WARS APP STREAM ---
  return (
    <div className="App">
      <img className="logo" src="/jedi-reddit-logo.png" alt="jedi reddit" />
      <h1 className="black-ops-one-regular">Star Wars Reddit</h1>

      {/* SEARCH CONTAINER WITH YOUR ORIGINAL CLEAN PROPERTIES */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Type transmission keyword..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="teko"
        />
        <button className="buttons" onClick={handleSearchSubmit}>
          <img src="/tie-fighter-search.png" alt="search" />
        </button>
      </div>
      <div className='category-container'>
      {categories.map((cat) => (
     <button key={cat.value} className='buttons' onClick={() => {
      dispatch(changeCategory());
      dispatch(fetchRedditPosts(cat.value));
     }}>
      <img src={cat.src} alt={cat.label} />
      <span>{cat.label}</span>
     </button>
      ))}
      </div>

      {/* Main card grid stream */}
      <div id="star-wars-container">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            
            {/* 1. IMAGE FIRST */}
            <img 
              className="image" 
              src={
                post.image && post.image.startsWith("http") && !post.image.includes("thumb")
                  ? post.image
                  : "https://images.unsplash.com/photo-1563089145-599997674d42?w=600"
              } 
              alt={post.title} 
              width="100%"
              height="auto"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1563089145-599997674d42?w=600";
              }}
            />

            {/* 2. TITLE SECOND */}
            <p className="teko">{post.title}</p>
            
            {/* 3. AUTHOR METADATA THIRD */}
            <p className='teko' style={{fontSize: '14px'}}>
              Posted by u/{post.author} • {post.timeAgo}
            </p>

            <div className="actions">
              <button className="buttons" onClick={() => dispatch(togglePostLike(post.id))}>
                <img 
                  src={post.isLiked ? '/lightsaber-like.png' : '/lightsaber-like-inactive.png'} 
                  alt="like" 
                />
              </button>
              
              <button className="buttons" onClick={() => handleCommentClick(post.id, post.permalink)}>
                <img src="/comment.png" alt="comments" />
              </button>
            </div>

            {/* DYNAMIC UNRAVELLING DISCUSSION DRAWER */}
            {openCommentId === post.id && (
              <div className="comment-section" style={{ textAlign: 'left', marginTop: '20px', background: 'var(--code-bg)', padding: '15px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <h3 className="teko">
                  DECODED TRANSMISSIONS:
                </h3>
                
                {loadingComments[post.id] && <p className="teko" style={{ color: 'var(--accent)' }}>Decoding frequencies...</p>}
                
                {commentsByPostId[post.id]?.map((comment) => (
                  <div key={comment.id} style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
                    <strong style={{ color: 'var(--accent)', fontSize: '14px' }}>u/{comment.author}</strong>
                    <p style={{ fontSize: '16px', marginTop: '4px', textAlign: 'left', clear: 'none' }}>{comment.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Backup notice if search yields no results */}
        {filteredPosts.length === 0 && !isLoading && (
          <p className="teko">
            No records found in the Jedi archives matching that query.
          </p>
        )}
      </div>

      {/* FIXED SYNTAX BLOCK HERE */}
      {isLoading && (
        <p className="teko">
          Loading from a galaxy far far away...
        </p>
      )}
    </div>
  );
}

export default App;