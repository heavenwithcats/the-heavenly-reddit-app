let afterID = null;
let isFetching = false;

async function getStarWarsReddit() {
   if(isFetching) return;
   
    const container = document.getElementById('star-wars-container');
    if(afterID === null) {
        container.innerHTML = '';
    }
    isFetching = true;
   const proxyUrl = 'https://corsproxy.io/?'
       const targetUrl ='https://www.reddit.com/r/StarWars/hot.json?limit=25';
     if (afterID) {
        targetUrl += `&after=${afterID}`;
     }
    try {
;
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        
        if (!response.ok) throw new Error("Vader cut the server");
        
        const data = await response.json();
        afterID = data.data.after;
        const posts = data.data.children;
        
   
        
        posts.forEach(post => {
            const p = post.data;
            
            // Check if it's an image post
            if (p.url.includes('.jpg') || p.url.includes('.png') || p.url.includes('.gif')) {
                container.innerHTML += `
                <div class="post-card">
                    <img class="image" src="${p.url}" alt="${p.title}">
                    <p class="teko">${p.title}</p>
                    <div class="actions">
                        <button class="buttons">
                            <img src="/lightsaber-like-inactive.png" alt="like">
                        </button>
                        <button class="buttons">
                            <img src="/comment.png" alt="comments">
                        </button>
                    </div>
                </div>
                `;
            }
        });
        
    } catch (error) {
        // This runs if the fetch fails
        container.innerHTML = `
            <div class="error-state">
                <img class="image" src="/darth-unavailable.jpg" alt="darth vader">
                <br>
                <p class="teko">Sorry, couldn't load this information because Darth Vader has cut up your server. Please check your internet connection and try again.</p>
            </div>
        `;
    } finally {
        isFetching = false
    }
}

window.addEventListener('scroll', ()=> {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200){
 console.log('Reaching into other galaxies far far away....')
   getStarWarsReddit()
}
})

// THIS LINE IS THE KEY: It tells the function to start!
getStarWarsReddit();