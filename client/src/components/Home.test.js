import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { useNavigate } from 'react-router-dom';
import Home from './Home';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('./TopBar.jsx', () => () => <div>TopBar Mock</div>);
jest.mock('./GameBoard.jsx', () => () => <div>GameBoard Mock</div>);
jest.mock('./UserPanel.jsx', () => () => <div>UserPanel Mock</div>);

const mockStore = configureMockStore();
const store = mockStore({});

describe('Home Component', () => {
    let navigate;

    beforeEach(() => {
        navigate = jest.fn();
        require('react-router-dom').useNavigate.mockReturnValue(navigate);
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the Home component', () => {
        expect(screen.getByPlaceholderText('ENTER YOUR USERNAME')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('ENTER A ROOM NAME')).toBeInTheDocument();
        expect(screen.getByText('JOIN ROOM')).toBeInTheDocument();
    });

    it('updates username and roomName state on input change', () => {
        const usernameInput = screen.getByPlaceholderText('ENTER YOUR USERNAME');
        const roomNameInput = screen.getByPlaceholderText('ENTER A ROOM NAME');

        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(roomNameInput, { target: { value: 'testRoom' } });

        expect(usernameInput.value).toBe('testUser');
        expect(roomNameInput.value).toBe('testRoom');
    });

    it('shows an inline error if username or roomName is empty', () => {
        const joinButton = screen.getByText('JOIN ROOM');
        fireEvent.click(joinButton);

        expect(screen.getAllByText('This field is required.').length).toBeGreaterThanOrEqual(1);
    });

    it('shows an inline error if username or roomName contains non-alphanumeric characters', () => {
        const usernameInput = screen.getByPlaceholderText('ENTER YOUR USERNAME');
        const roomNameInput = screen.getByPlaceholderText('ENTER A ROOM NAME');
        const joinButton = screen.getByText('JOIN ROOM');

        fireEvent.change(usernameInput, { target: { value: 'test@User' } });
        fireEvent.change(roomNameInput, { target: { value: 'testRoom' } });
        fireEvent.click(joinButton);

        expect(screen.getByText('Only letters and numbers allowed (no spaces or special characters).')).toBeInTheDocument();
    });

    it('navigates to the correct room if inputs are valid', () => {
        const usernameInput = screen.getByPlaceholderText('ENTER YOUR USERNAME');
        const roomNameInput = screen.getByPlaceholderText('ENTER A ROOM NAME');
        const joinButton = screen.getByText('JOIN ROOM');

        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(roomNameInput, { target: { value: 'testRoom' } });
        fireEvent.click(joinButton);

        expect(navigate).toHaveBeenCalledWith('/testRoom/testUser');
    });
});
