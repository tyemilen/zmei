<script setup>
import { onMounted, ref } from 'vue';

import { useGameStore } from '@/stores/game';

import constants from '@/constants';
import { useSettingsStore } from '@/stores/settings';

const { COLUMN_COUNT, ROW_COUNT, RECT_HEIGHT, RECT_WIDTH, SPACING, COLORS } = constants;

const props = defineProps({
    columns: Number,
    rows: Number
});

const game = useGameStore();

const WIDTH = (COLUMN_COUNT * (RECT_WIDTH + SPACING)) - SPACING;
const HEIGHT = (ROW_COUNT * (RECT_HEIGHT + SPACING)) - SPACING;

function isEmpty(row) {
	return row == constants.EMPTY;
}

function renderMap(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    let x = 10;
    let y = 10;

    for (let row = 0; row < game.map.length; ++row) {
        for (let column = 0; column < game.map[row].length; ++column) {
			context.beginPath();
            context.fillStyle = isEmpty(game.map[row][column]) ? ((row + column) % 2 ? COLORS.EMPTY_EVEN : COLORS.EMPTY_ODD) : COLORS[game.map[row][column]];
            context.beginPath();
			context.roundRect(x, y, RECT_WIDTH, RECT_HEIGHT, 2);
			context.fill();

			x += RECT_WIDTH + SPACING;
        }
        x = 10;
        y += RECT_HEIGHT + SPACING;
    }
}

function updateGame(context) {
    game.updateSnakePos();
    renderMap(context);
}

const settings = useSettingsStore();

let lastRender = 0;
const fps = 10;
const fpsInterval = 1000 / fps;

function gameLoop(timestamp, context) {
    if (game.paused || game.dead) return;

    if (settings.enableStupidSnake) {
        const interval = setInterval(() => {
            if (!settings.enableStupidSnake) return clearInterval(interval);
            if (game.dead) {
                game.restart();

                return requestAnimationFrame((timestamp) => {
                    gameLoop(timestamp, context)
                });
            }
            game.stupidSnakeMove();
        }, 100);
    }
    const progress = timestamp - lastRender;

    if (progress >= fpsInterval) {
        updateGame(context);
        lastRender = timestamp;
    }

	requestAnimationFrame((timestamp) => gameLoop(timestamp, context));
}

const initPause = ref(true);

function keyboardListener(event, context) {
	if (game.dead) {
        game.restart();

        return requestAnimationFrame((timestamp) => {
            gameLoop(timestamp, context)
        });
    }

    if (event.key == 'Escape' && game.paused) {
        if (initPause.value) initPause.value = false;
        game.unpause();
        
        return requestAnimationFrame((timestamp) => {
            gameLoop(timestamp, context)
        });
    } else if (event.key == 'Escape' && !game.paused) return game.pause();

    if (event.key === 'ArrowUp' && game.snake.direction !== constants.SNAKE_DIRECTION.DOWN) {
        game.updateSnakeDir(constants.SNAKE_DIRECTION.UP);
    } else if (event.key === 'ArrowDown' && game.snake.direction !== constants.SNAKE_DIRECTION.UP) {
        game.updateSnakeDir(constants.SNAKE_DIRECTION.DOWN);
    } else if (event.key === 'ArrowLeft' && game.snake.direction !== constants.SNAKE_DIRECTION.RIGHT) {
        game.updateSnakeDir(constants.SNAKE_DIRECTION.LEFT);
    } else if (event.key === 'ArrowRight' && game.snake.direction !== constants.SNAKE_DIRECTION.LEFT) {
        game.updateSnakeDir(constants.SNAKE_DIRECTION.RIGHT);
    }
}

onMounted(() => {
    game.init(COLUMN_COUNT, ROW_COUNT);

    const canvas = document.getElementById('game');
    /** @type {HTMLCanvasElement}
    */
    const context = canvas.getContext('2d');

	canvas.style.width = '100%';
	canvas.style.height = '100%';

	canvas.width = canvas.offsetWidth;
  	canvas.height = canvas.offsetHeight;

    window.addEventListener('keydown', event => keyboardListener(event, context));

    requestAnimationFrame((timestamp) => {
        gameLoop(timestamp, context)
    });
});
</script>
<template>
	<div class="border-4 border-black/60 flex items-center justify-center relative" :style="{'width': `${WIDTH + 27}px`, 'height': `${HEIGHT + 27}px`}">
        <div v-if="game.dead" class="absolute top-0 left-0 w-full h-full bg-snake-second/90 flex items-center justify-center flex-col gap-2">
			<span class="text-4xl font-bold font-vt323 text-black">fin.</span>
			<span class="text-xl font-vt323 text-black">Press any key to restart</span>
		</div>
        <div v-if="game.paused && initPause" class="absolute top-0 left-0 w-full h-full bg-snake-second/90 flex items-center justify-center flex-col gap-2">
			<span class="text-4xl font-bold font-vt323 text-black">Zmei</span>
			<span class="text-xl font-vt323 text-black">Press ESCAPE to start</span>
		</div>
        <div v-if="game.paused && !initPause" class="absolute top-0 left-0 w-full h-full bg-snake-second/90 flex items-center justify-center flex-col gap-2">
			<span class="text-4xl font-bold font-vt323 text-black">Pause</span>
			<span class="text-xl font-vt323 text-black">Press ESCAPE to continue</span>
		</div>
        <canvas id="game" />
    </div>
</template>