import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './MasterButton.css';

const MasterButton = () => {

    const clickEvent = () => {
      console.log("CLICK");
    };

    return (
        <div className="master-button-container">
            <button className="master-button" onClick={clickEvent}>START THE GAME</button>
        </div>
    );
};

export default MasterButton;