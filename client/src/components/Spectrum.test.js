import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spectrum from './Spectrum';

jest.mock('./Board.jsx', () => () => <div data-testid="board" />);

describe('Spectrum Component', () => {
    it('renders with a username and a mocked board.', () => {
        render(<Spectrum username="alice" boardElements="" />);

        expect(screen.getByText('alice')).toBeInTheDocument();
    });

});