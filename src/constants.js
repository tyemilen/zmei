const constants = {
    SNAKE: 2,
    FOOD: 1,
    EMPTY: 0,

    SNAKE_DIRECTION: {
        LEFT: 'left',
        RIGHT: 'right',
        DOWN: 'down',
        UP: 'up'
    },

    COLUMN_COUNT: 12,
    ROW_COUNT: 12,

    SPACING: 2,
    RECT_WIDTH: 32,
    RECT_HEIGHT: 32
};

const colors = {
    EMPTY_ODD: '#768f5b',
	EMPTY_EVEN: '#657a4e',
    [constants.FOOD]: '#000',
    [constants.SNAKE]: '#000',
};

export default {
    ...constants,
    COLORS: colors
}