import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NextPiece from './NextPiece';

describe('NextPiece Component', () => {
    it('renders the component.', () => {
        render(<NextPiece pieceName='O' />);

        expect(document.querySelector('.o-tile')).toBeInTheDocument();
    });

    it('renders the component.', () => {
        render(<NextPiece pieceName='T' />);

        expect(document.querySelector('.t-tile')).toBeInTheDocument();
    });

});