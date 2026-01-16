const Movements = Object.freeze({
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    FAST_DOWN: 'FAST_DOWN',
    ROTATE: 'ROTATE',
});

const MovementsPositions = Object.freeze({
    LEFT: {x: -1, y: 0, rotation: 0},
    RIGHT: {x: 1, y: 0, rotation: 0},
    DOWN: {x: 0, y: 1, rotation: 0},
    ROTATE: {x: 0, y: 0, rotation: 1},
})

module.exports = {Movements, MovementsPositions};