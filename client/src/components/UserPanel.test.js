import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import UserPanel from './UserPanel';

jest.mock('./OpponentsSpectrum.jsx', () => () => <div data-testid="opponents-spectrum" />);
jest.mock('./Rules.jsx', () => () => <div data-testid="rules" />);
jest.mock('./MasterButton.jsx', () => () => <div data-testid="master-button" />);

describe('UserPanel Component', () => {
    const mockGameState = {
        roomName: 'Test Room',
        username: 'Léo',
        players: [
            { username: 'Léo', isMaster: true, board: [] },
            { username: 'Alice', isMaster: false, board: [] },
        ],
    };

    const renderWithStore = (state) => {
        const store = configureStore({
            reducer: {
                game: (state = mockGameState) => state,
            },
            preloadedState: {
                game: state,
            },
        });

        render(
            <Provider store={store}>
                <UserPanel />
            </Provider>
        );
    };

    it('renders MasterButton if the current player is master', () => {
        renderWithStore(mockGameState);
        expect(screen.getByTestId('master-button')).toBeInTheDocument();
        expect(screen.getByTestId('opponents-spectrum')).toBeInTheDocument();
        expect(screen.getByTestId('rules')).toBeInTheDocument();
    });

    it('does not render MasterButton if the current player is not master', () => {
        const nonMasterState = {
            ...mockGameState,
            players: [
                { username: 'Léo', isMaster: false, board: [] },
                { username: 'Alice', isMaster: true, board: [] },
            ],
        };
        renderWithStore(nonMasterState);
        expect(screen.queryByTestId('master-button')).not.toBeInTheDocument();
        expect(screen.getByTestId('opponents-spectrum')).toBeInTheDocument();
        expect(screen.getByTestId('rules')).toBeInTheDocument();
    });

    it('does not render MasterButton if the current player is in the list', () => {
        const nonMasterState = {
            ...mockGameState,
            players: [
                { username: 'Alice', isMaster: true, board: [] },
            ],
        };
        renderWithStore(nonMasterState);
        expect(screen.queryByTestId('master-button')).not.toBeInTheDocument();
        expect(screen.getByTestId('opponents-spectrum')).toBeInTheDocument();
        expect(screen.getByTestId('rules')).toBeInTheDocument();
    });

});
