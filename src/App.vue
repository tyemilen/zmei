<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import Game	from '@/components/Game.vue';

import { useStatsStore } from '@/stores/stats';
import { useSettingsStore } from './stores/settings';

const stats = useStatsStore();
const settings = useSettingsStore();

const { points } = storeToRefs(stats);

const showMessage = ref(false);

watch(points, () => {
	if (points.value <= 0) return;

	showMessage.value = true;

	setTimeout(() => {
		showMessage.value = false;
	}, 1000);
});
</script>

<template>
	<div class="w-full h-full bg-snake-second flex items-center flex-col justify-center gap-5">
		<div class="w-full h-fit flex flex-row items-center justify-evenly">
			<div class="w-fit h-fit p-2 rounded-md flex flex-col items-center relative">
				<span class="text-xl font-bold text-black font-vt323">POINTS</span>
				<span class="text-xl font-bold text-black font-vt323">{{ stats.points * 10 }}</span>
				<span v-if="showMessage" class="animate-reveal font-bold text-black/20 font-vt323 absolute bottom-0 right-2">+ 10</span>
			</div>
			<div class="w-fit h-fit p-2 rounded-md flex flex-col items-center">
				<span class="text-xl font-bold text-black font-vt323">BIGGEST SCORE</span>
				<span class="text-xl font-extrabold text-black font-vt323">{{ stats.biggestScore * 10 }}</span>
			</div>
			<div class="w-fit h-fit p-2 rounded-md flex flex-col items-center">
				<span class="text-xl font-bold text-black font-vt323">DEATHS</span>
				<span class="text-xl font-extrabold text-black font-vt323">{{ stats.deaths.toString().padStart(2, '0') }}</span>
			</div>
		</div>
		<Game />
		<div class="flex justify-between w-1/2 font-vt323 text-xl items-center">
			<div class="flex flex-col items-center">
				<div class="flex flex-col items-center gap-[2px]">
					<div class="w-6 text-snake-second font-extrabold font-mono bg-black text-center">↑</div>
					<div class="flex flex-row gap-[2px]">
						<div class="w-6 text-snake-second font-extrabold font-mono bg-black text-center">←</div>
						<div class="w-6 text-snake-second font-extrabold font-mono bg-black text-center">↓</div>
						<div class="w-6 text-snake-second font-extrabold font-mono bg-black text-center">→</div>
					</div>
				</div>
				<span>Move</span>
			</div>
			<div class="flex flex-col gap-2">
				<span class="cursor-pointer" @click="settings.toogleStupidSnake()">{{ settings.enableStupidSnake ? 'Disable' : 'Enable' }} stupid snake</span>
			</div>
			<div class="flex flex-col items-center">
				<div class="text-snake-second pl-1 pr-1 bg-black text-center">Esc</div>
				<span>Pause</span>
			</div>
		</div>
	</div>
</template>