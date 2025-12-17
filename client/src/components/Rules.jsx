import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Rules.css';

const Rules = () => {

    return (
        <div className="rules-container">
            <h1>Rules</h1>
            <ul>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            </ul>
        </div>
    );
};

export default Rules;