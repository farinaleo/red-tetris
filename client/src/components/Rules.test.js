import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Rules from './Rules';

describe('Rules Component', () => {
    it('renders the component.', () => {
        render(<Rules />);

        expect(screen.queryByText(/UP/i)).toBeInTheDocument();
    });

});