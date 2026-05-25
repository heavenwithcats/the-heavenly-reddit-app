import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedditPosts, fetchPostComments } from './store/redditActions';
import { togglePostLike, setSearchTerm } from './store/redditSlice';

function App() {
  const dispatch = useDispatch();
  
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

      {/* RE-STYLED SEARCH BAR & BUTTON FLEX CONTAINER */}
      <div className="search-container" style={{ 
        margin: '20px auto', 
        maxWidth: '500px', 
        padding: '0 20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Type transmission keyword..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="teko"
          style={{
            flex: 1,
            padding: '10px 15px',
            fontSize: '20px',
            background: '#111',
            border: '2px solid var(--border)',
            borderRadius: '4px',
            color: 'white',
            letterSpacing: '1px'
          }}
        />
        <button className="buttons" onClick={handleSearchSubmit} style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* UPDATED: Uses your requested custom Tie Fighter asset! */}
          <img src="/tie-fighter-search.png" alt="search" style={{ height: '100%', width: 'auto' }} />
        </button>
      </div>

      {/* Main card grid stream */}
      <div id="star-wars-container">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <p className="teko">{post.title}</p>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px', textAlign: 'left' }}>
              Posted by u/{post.author} • {post.timeAgo}
            </p>
            
            {/* UPDATED: Image tag with integrated fallback checking */}
            <img 
              className="image" 
              src={
                post.image && post.image.startsWith("http") && !post.image.includes("thumb")
                  ? post.image
                  : "https://images.unsplash.com/photo-1563089145-599997674d42?w=600" // Star Wars lightsaber theme asset
              } 
              alt={post.title} 
              onError={(e) => {
                // If a link reports broken layout half-way through, swap to our cinematic Star Wars background
                e.target.src = "https://images.unsplash.com/photo-1563089145-599997674d42?w=600";
              }}
            />

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
                <h3 className="teko" style={{ fontSize: '22px', margin: '0 0 10px 0', color: 'var(--text-h)' }}>
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
          <p className="teko" style={{ fontSize: '24px', color: '#aaa', marginTop: '40px' }}>
            No records found in the Jedi archives matching that query.
          </p>
        )}
      </div>

      {isLoading && (
        <p className="loading" style={{ textAlign: 'center', padding: '20px' }}>
          Loading from a galaxy far far away...
        </p>
      )}
    </div>
  );
}

export default App;