import { useState } from "react";

export const useAudio = () => {
    const urlSoundEnd = "/Bell3X.ogg";
    const urlSoundStart = "/Bell1X.ogg";
    const urlSoundLastTenSeconds = "/warning.ogg";

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
