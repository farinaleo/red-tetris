import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OpponentsSpectrum from './OpponentsSpectrum';

jest.mock('./Spectrum.jsx', () => ({ username, boardElements }) => (
    <div data-testid="spectrum-mock">
        {username} - {boardElements.length} elements
    </div>
));


describe('Opponents spectrum Component', () => {
    it('renders without opponents.', () => {

        const opponents = [];
        render(<OpponentsSpectrum opponents={opponents} />);

        expect(screen.queryAllByTestId('spectrum-mock')).toHaveLength(0);
    });

    it('renders with opponents.', () => {

        const opponents = [
            ['alice', ''],
            ['doudou','']
        ];
        render(<OpponentsSpectrum opponents={opponents} />);

        expect(screen.queryByText(/alice/i)).toBeInTheDocument();
        expect(screen.queryAllByTestId('spectrum-mock')).toHaveLength(2);
    });

});