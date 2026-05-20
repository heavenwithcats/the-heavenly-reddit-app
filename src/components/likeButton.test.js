import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import LikeButton from './lightsaberLikeButton'

const mockStore = configureStore([]);
describe('LikeButton Component', () => {
    let store;

    beforeEach(() => {
    store = mockStore({
        likes: {
            likedPosts: { 'star-wars-1': false }
        }
    });
    });
    test('should show the hilt image when the post is not liked', () => {
    render(
        <Provider store={store}>
       <LikeButton
        postId="star-wars-1" 
          hiltImage="lightsaber-like-inactive.png"
       lightsaberImage="lightsaber-like.png"
       />
     </Provider>
    );
const image = screen.getByAltText('Lightsaber Like Button')
    expect(image.src).toContain('lightsaber-like-inactive.png')
}
    );

 test('should dispatch the toggle action when the button is clicked', () => {
    render(
        <Provider store={store}>
       <LikeButton
        postId="star-wars-1" 
          hiltImage="lightsaber-like-inactive.png"
       lightsaberImage="lightsaber-like.png"
       />
     </Provider>
    );

const button = screen.getByRole('button');
fireEvent.click(button);

const actions = store.getActions();
expect(actions[0].type).toBe('likes/toggleLike');
expect(actions[0].payload).toBe('star-wars-1');
 
 })
});
