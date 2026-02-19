import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureMockStore from 'redux-mock-store';
import { useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import Game from './Game';
import { joinRoom } from '../store/actions';

// Mock the actions
jest.mock('../store/actions', () => ({
    joinRoom: jest.fn((roomName, username) => ({
        type: 'joinRoom',
        payload: {roomName, username},
    })),
    movePiece: jest.fn((direction) => ({
        type: 'MOVE_PIECE',
        payload: { direction },
    })),
}));


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

const navigate = useNavigate();

// Mock the components that are causing issues
jest.mock('./NextPiece.jsx', () => () => <div>NextPiece Mock</div>);
jest.mock('./GameBoard.jsx', () => () => <div>GameBoard Mock</div>);
jest.mock('./UserPanel.jsx', () => () => <div>UserPanel Mock</div>);
jest.mock('./TopBar.jsx', () => ({ username, roomName }) => (
    <div>
        <div>{username}</div>
        <div>{roomName}</div>
    </div>
));

const mockStore = configureMockStore();
const store = mockStore({
    game: {
        roomName: 'testRoom',
        username: 'testUser',
    },
});

describe('Game', () => {
    let originalLocation;

    beforeEach(() => {
        navigate('/testRoom/testUser')
    });

    afterEach(() => {
        navigate('/')
    });


    it('renders the component', () => {
        render(
            <Provider store={store}>
                <Game />
            </Provider>
        );
        expect(screen.getByText('testUser')).toBeInTheDocument();
        expect(screen.getByText('testRoom')).toBeInTheDocument();
    });

    it('dispatches joinRoom action with correct parameters', () => {
        render(
            <Provider store={store}>
                <Game />
            </Provider>
        );

        // Check if joinRoom was called with the correct parameters
        const actions = store.getActions();
        expect(actions[0].type).toEqual('joinRoom');
        expect(actions[0].payload).toEqual({roomName: 'general', username: 'anonymous'});
    });

    it('dispatches movePiece action on key press', () => {
        render(
            <Provider store={store}>
                <Game />
            </Provider>
        );

        // Simulate key presses
        fireEvent.keyDown(window, { key: 'ArrowUp' });
        const actions = store.getActions();
        expect(actions.some(action => action.type === 'MOVE_PIECE' && action.payload.direction === 'ROTATE')).toBe(true);

        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        expect(actions.some(action => action.type === 'MOVE_PIECE' && action.payload.direction === 'LEFT')).toBe(true);

        fireEvent.keyDown(window, { key: 'ArrowRight' });
        expect(actions.some(action => action.type === 'MOVE_PIECE' && action.payload.direction === 'RIGHT')).toBe(true);

        fireEvent.keyDown(window, { key: 'ArrowDown' });
        expect(actions.some(action => action.type === 'MOVE_PIECE' && action.payload.direction === 'DOWN')).toBe(true);

        fireEvent.keyDown(window, { key: ' ' });
        expect(actions.some(action => action.type === 'MOVE_PIECE' && action.payload.direction === 'FAST_DOWN')).toBe(true);
    });

});
