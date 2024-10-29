import { useState } from "react";

export const useAudio = () => {
    const urlSoundEnd = "/gong.ogg";
    const urlSoundStart = "/gong.ogg";
    const urlSoundLastTenSeconds = "/gong.ogg";

    const [isSoundActive, setIsSoundActive] = useState(true);

    function playSound(url: string) {
        if (!isSoundActive) {
            return;
        }
        const audio = new Audio(url);
        audio.play();
    }

    function playStartSound() {
        playSound(urlSoundStart);
    }

    function playLastTenSecondsSound() {
        playSound(urlSoundLastTenSeconds);
    }

    function playEndSound() {
        playSound(urlSoundEnd);
    }

    function toggleSound() {
        setIsSoundActive(isSoundActive => !isSoundActive);
    }


    return {
        playEndSound,
        playStartSound,
        playLastTenSecondsSound,
        isSoundActive,
        toggleSound,
    }
};
