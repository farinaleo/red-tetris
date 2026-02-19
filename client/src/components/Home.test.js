import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Home from './Home';

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

// Mock react-toastify's toast
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
}));

// Mock child components
jest.mock('./TopBar.jsx', () => () => <div>TopBar Mock</div>);
jest.mock('./GameBoard.jsx', () => () => <div>GameBoard Mock</div>);
jest.mock('./UserPanel.jsx', () => () => <div>UserPanel Mock</div>);

// Configure mock store
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

    it('shows an error toast if username or roomName is empty', () => {
        const joinButton = screen.getByText('JOIN ROOM');
        fireEvent.click(joinButton);

        expect(toast.error).toHaveBeenCalledWith(
            'Connexion: Please enter both username and room name.',
            expect.any(Object)
        );
    });

    it('shows an error toast if username or roomName contains non-alphanumeric characters', () => {
        const usernameInput = screen.getByPlaceholderText('ENTER YOUR USERNAME');
        const roomNameInput = screen.getByPlaceholderText('ENTER A ROOM NAME');
        const joinButton = screen.getByText('JOIN ROOM');

        fireEvent.change(usernameInput, { target: { value: 'test@User' } });
        fireEvent.change(roomNameInput, { target: { value: 'testRoom' } });
        fireEvent.click(joinButton);

        expect(toast.error).toHaveBeenCalledWith(
            'Connexion: Username and room name must be alphanumeric (only letters and numbers, no spaces or special characters).',
            expect.any(Object)
        );
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
