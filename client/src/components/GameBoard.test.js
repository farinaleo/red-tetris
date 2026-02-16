import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import GameBoard from './GameBoard';

const mockStore = configureMockStore();

describe('GameBoard', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            game: {
                game_status: 'WAITING',
                next_piece: 'T',
                current_board: [],
            },
        });
    });

    it('renders the component', () => {
        render(
            <Provider store={store}>
                <GameBoard />
            </Provider>
        );
        expect(screen.getByText('WAITING')).toBeInTheDocument();
    });

    it('applies the correct CSS class for WAITING status', () => {
        render(
            <Provider store={store}>
                <GameBoard />
            </Provider>
        );
        const statusDiv = screen.getByText('WAITING').parentElement;
        expect(statusDiv).toHaveClass('game-board-status waiting');
    });

    it('applies the correct CSS class for STARTED status', () => {
        store = mockStore({
            game: {
                game_status: 'STARTED',
                next_piece: 'T',
                current_board: [],
            },
        });

        render(
            <Provider store={store}>
                <GameBoard />
            </Provider>
        );
        const statusDiv = screen.getByText('STARTED').parentElement;
        expect(statusDiv).toHaveClass('game-board-status started');
    });

    it('applies the correct CSS class for FINISHED status', () => {
        store = mockStore({
            game: {
                game_status: 'FINISHED',
                next_piece: 'T',
                current_board: [],
            },
        });

        render(
            <Provider store={store}>
                <GameBoard />
            </Provider>
        );
        const statusDiv = screen.getByText('FINISHED').parentElement;
        expect(statusDiv).toHaveClass('game-board-status finished');
    });

    it('applies the correct CSS class for unknow status', () => {
        store = mockStore({
            game: {
                game_status: 'BLABLABLA',
                next_piece: 'T',
                current_board: [],
            },
        });

        render(
            <Provider store={store}>
                <GameBoard />
            </Provider>
        );
        const statusDiv = screen.getByText('BLABLABLA').parentElement;
        expect(statusDiv).toHaveClass('game-board-status');
    });
});
