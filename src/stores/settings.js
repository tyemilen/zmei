import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', () => {
    const enableStupidSnake = ref(false);
    
    const toogleStupidSnake = () => enableStupidSnake.value = enableStupidSnake.value ? false : true;

    return { enableStupidSnake, toogleStupidSnake };
});