import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopBar from './TopBar';

describe('TopBar Component', () => {
    it('renders only the logo when username and roomName are empty', () => {
        render(<TopBar username="" roomName="" />);

        expect(screen.getByText('-TETRIS')).toBeInTheDocument();

        expect(screen.queryByText(/Username:/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Room:/i)).not.toBeInTheDocument();
    });

    it('renders username, logo, and room when props are provided', () => {
        render(<TopBar username="Léo" roomName="MainRoom" />);

        expect(screen.getByText('-TETRIS')).toBeInTheDocument();

        expect(screen.getByText('Username: Léo')).toBeInTheDocument();
        expect(screen.getByText('Room: MainRoom')).toBeInTheDocument();
    });
});
