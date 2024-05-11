import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStatsStore = defineStore('stats', () => {
    const points = ref(0);
    const biggestScore = ref(0);
    const deaths = ref(0);

    function restart() {
        biggestScore.value = points.value > biggestScore.value ? points.value : biggestScore.value;
        points.value = 0;

        deaths.value += 1
    }

    function updatePoints() {
        points.value += 1;
        
        biggestScore.value = points.value > biggestScore.value ? points.value : biggestScore.value;
    }

    return {
        points,
        biggestScore,
        deaths,
        restart,
        updatePoints
    };
});