import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';

import constants from '@/constants';
import { useStatsStore } from './stats';

const generateEmptyMap = (columns, rows) => Array.from({ length: columns }, () => Array(rows).fill(constants.EMPTY));

export const useGameStore = defineStore('game', () => {
    const stats = useStatsStore();

    const dead = ref(false);
    const paused = ref(true);

    const mapSize = ref({ columns: 0, rows: 0 });

    const map = ref([]);

    const snake = reactive({
        position: { x: 0, y: 0 },
        direction: constants.SNAKE_DIRECTION.DOWN,
        body: [],
    });
    const food = reactive({
        position: { x: 0, y: 0 },
    });

    const updateSnakeDir = (dir) => snake.direction = dir;

    const kill = () => dead.value = true;
    
    const pause = () => paused.value = true;
    const unpause = () => paused.value = false;

    function updateSnakePos() {
        let newHead = { ...snake.position };
        switch (snake.direction) {
            case constants.SNAKE_DIRECTION.UP:
                newHead.y -= 1;
                break;
            case constants.SNAKE_DIRECTION.DOWN:
                newHead.y += 1;
                break;
            case constants.SNAKE_DIRECTION.LEFT:
                newHead.x -= 1;
                break;
            case constants.SNAKE_DIRECTION.RIGHT:
                newHead.x += 1;
                break;
        }
        
        if (newHead.x < 0 || newHead.x >= mapSize.value.columns || newHead.y < 0 || newHead.y >= mapSize.value.rows) {
            kill();
            return;
        }

        snake.body.forEach(part => {
            if (part.y == newHead.y && part.x == newHead.x) return kill();

            map.value[part.y][part.x] = constants.EMPTY;
        });
        
        map.value[snake.position.y][snake.position.x] = constants.EMPTY;
    
        if (newHead.x === food.position.x && newHead.y === food.position.y) {
            stats.updatePoints();
            generateFood();

            if (snake.body.length > 0) {
                const newSegmentPosition = { ...snake.body[snake.body.length - 1] };
                snake.body.push(newSegmentPosition);
            }
        } else {
            snake.body.pop();
        }
    
        snake.body.unshift(newHead);
        snake.position = newHead;
    
        snake.body.forEach(part => map.value[part.y][part.x] = constants.SNAKE);
        map.value[snake.position.y][snake.position.x] = constants.SNAKE;
    };

    function generateFood() {
        let foodX, foodY;
        let attempts = 0;
        do {
            foodX = Math.floor(Math.random() * mapSize.value.rows);
            foodY = Math.floor(Math.random() * mapSize.value.columns);
            attempts++;
            if (attempts > 500) break;
        } while (snake.body.some(part => part.x === foodX && part.y === foodY));
        
        food.position = { x: foodX, y: foodY };
        map.value[foodY][foodX] = constants.FOOD;
    };

    function restart() {
        stats.restart();

        dead.value = false;

        map.value = generateEmptyMap(mapSize.value.columns, mapSize.value.rows);
        
        snake.direction = constants.SNAKE_DIRECTION.DOWN;
        snake.position = { x: 0, y: 0 };
        snake.body = [];

        food.position = { x: 0, y: 0 };

        generateFood();
    };

    function init(height, width) {
        dead.value = false;

        mapSize.value.columns = height;
        mapSize.value.rows = width;

        map.value = generateEmptyMap(height, width);
        map.value[snake.position.x][snake.position.y] = constants.SNAKE;

        food.position = { x: 0, y: 0 };

        generateFood();

        return map;
    };


    function stupidSnakeMove() {
        if (food.position.x > snake.position.x) {
            if (snake.direction == constants.SNAKE_DIRECTION.LEFT) return;

            updateSnakeDir(constants.SNAKE_DIRECTION.RIGHT);
        } else if (food.position.x < snake.position.x) {
            if (snake.direction == constants.SNAKE_DIRECTION.RIGHT) return;

            updateSnakeDir(constants.SNAKE_DIRECTION.LEFT);
        } else if (food.position.y > snake.position.y) {
            if (snake.direction == constants.SNAKE_DIRECTION.UP) return;

            updateSnakeDir(constants.SNAKE_DIRECTION.DOWN);
        } else if (food.position.y < snake.position.y) {
            if (snake.direction == constants.SNAKE_DIRECTION.DOWN) return;

            updateSnakeDir(constants.SNAKE_DIRECTION.UP);
        }
    }

    return { map, dead, paused, snake, init, restart, pause, unpause, updateSnakeDir, updateSnakePos, stupidSnakeMove };
});