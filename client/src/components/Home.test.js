// // import { TextEncoder, TextDecoder } from 'util';
// //
// // // Add these to the global scope
// // global.TextEncoder = TextEncoder;
// // global.TextDecoder = TextDecoder;
//
// import React from 'react';
//
// import { render, screen, fireEvent } from '@testing-library/react';
// import Home from './Home';
// // import { useNavigate } from 'react-router-dom';
//
// // // Mock the useNavigate hook
// // jest.mock('react-router-dom', () => ({
// //     ...jest.requireActual('react-router-dom'),
// //     useNavigate: jest.fn(),
// // }));
//
// describe('Home Component', () => {
//     beforeEach(() => {
//         // Clear all mocks before each test
//         jest.clearAllMocks();
//     });
//
//     test('renders Home component', () => {
//         render(<Home />);
//         expect(screen.getByPlaceholderText('ENTER YOUR USERNAME')).toBeInTheDocument();
//         expect(screen.getByPlaceholderText('ENTER A ROOM NAME')).toBeInTheDocument();
//         expect(screen.getByText('JOIN ROOM')).toBeInTheDocument();
//     });
//
//     test('updates username and roomName state on input change', () => {
//         render(<Home />);
//         const usernameInput = screen.getByPlaceholderText('ENTER YOUR USERNAME');
//         const roomNameInput = screen.getByPlaceholderText('ENTER A ROOM NAME');
//
//         fireEvent.change(usernameInput, { target: { value: 'testUser' } });
//         fireEvent.change(roomNameInput, { target: { value: 'testRoom' } });
//
//         expect(usernameInput.value).toBe('testUser');
//         expect(roomNameInput.value).toBe('testRoom');
//     });
//
//     test('navigates to the correct route when both fields are filled', () => {
//         const mockNavigate = jest.fn();
//         useNavigate.mockReturnValue(mockNavigate);
//
//         render(<Home />);
//         const usernameInput = screen.getByPlaceholderText('ENTER YOUR USERNAME');
//         const roomNameInput = screen.getByPlaceholderText('ENTER A ROOM NAME');
//         const joinButton = screen.getByText('JOIN ROOM');
//
//         fireEvent.change(usernameInput, { target: { value: 'testUser' } });
//         fireEvent.change(roomNameInput, { target: { value: 'testRoom' } });
//         fireEvent.click(joinButton);
//
//         expect(mockNavigate).toHaveBeenCalledWith('/testRoom/testUser');
//     });
//
//     test('shows alert when either field is empty', () => {
//         // Mock the alert function
//         const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
//
//         render(<Home />);
//         const usernameInput = screen.getByPlaceholderText('ENTER YOUR USERNAME');
//         const roomNameInput = screen.getByPlaceholderText('ENTER A ROOM NAME');
//         const joinButton = screen.getByText('JOIN ROOM');
//
//         // Test with empty username
//         fireEvent.change(usernameInput, { target: { value: '' } });
//         fireEvent.change(roomNameInput, { target: { value: 'testRoom' } });
//         fireEvent.click(joinButton);
//         expect(mockAlert).toHaveBeenCalledWith('Please enter both username and room name.');
//
//         // Test with empty room name
//         fireEvent.change(usernameInput, { target: { value: 'testUser' } });
//         fireEvent.change(roomNameInput, { target: { value: '' } });
//         fireEvent.click(joinButton);
//         expect(mockAlert).toHaveBeenCalledWith('Please enter both username and room name.');
//
//         // Clean up the mock
//         mockAlert.mockRestore();
//     });
// });
