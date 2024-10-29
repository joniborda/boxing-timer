
export const useAudio = () => {
    const urlSoundEnd = "/gong.ogg";
    const urlSoundStart = "/gong.ogg";
    const urlSoundLastTenSeconds = "/gong.ogg";

    function playSound(url: string) {
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



    return {
        playEndSound,
        playStartSound,
        playLastTenSecondsSound
    }
};
