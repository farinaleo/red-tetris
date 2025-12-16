import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Board.css';

const Board = () => {
    const list = Array.from({ length: 200 }, (_, index) => `Élément ${index + 1}`);
    useEffect(() => {
        console.log(list);
    }, []);

    const getClassName = (index) => {
        const tileY = Math.floor(index / 10);
        const tileX = index % 10;
        if (tileX % 2 === 0) {
            if (tileY % 2 === 0) {
                return 'tile white';
            } else {
                return 'tile gray';
            }
        } else {
            if (tileY % 2 === 0) {
                return 'tile gray';
            } else {
                return 'tile white';
            }
        }
    };

    return (
        <div className="board-container">
            {list.map((element, index) => (
                <div className={getClassName(index)}></div>
            ))}
        </div>
    );
};

export default Board;