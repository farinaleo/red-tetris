import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import MasterButton from './MasterButton';
import * as actions from '../store/actions';

jest.mock('../store/actions', () => ({
    StartGame: jest.fn((roomName) => ({
        type: 'StartGame',
        payload: roomName,
    })),
}));

const mockStore = configureMockStore();
const store = mockStore({
    game: {
        roomName: 'testRoom',
        username: 'testUser',
    },
});

describe('MasterButton', () => {
    it('renders the button', () => {
        render(
            <Provider store={store}>
                <MasterButton />
            </Provider>
        );
        expect(screen.getByText('START THE GAME')).toBeInTheDocument();
    });

    it('dispatches StartGame action with roomName when clicked', () => {
        render(
            <Provider store={store}>
                <MasterButton />
            </Provider>
        );

        const button = screen.getByText('START THE GAME');
        fireEvent.click(button);

        const actions = store.getActions();
        expect(actions[0].type).toEqual('StartGame');
        expect(actions[0].payload).toEqual('testRoom');
    });
});

