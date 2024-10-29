import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "./useAudio";

export const useTimer = () => {
    const { playEndSound, playStartSound, playLastTenSecondsSound, isSoundActive, toggleSound } = useAudio();

    const refInterval = useRef<NodeJS.Timeout | undefined>();
    const [seconds, setSeconds] = useState(0);
    const [minutesPerRound, setMinutesPerRound] = useState(2);
    const [minutes, setMinutes] = useState(minutesPerRound);
    const [rounds, setRounds] = useState(1);
    const [maxRounds, setMaxRounds] = useState(3);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreakTime, setIsBreakTime] = useState(false);
    const [isLastTenSeconds, setIsLastTenSeconds] = useState(false);
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [warmupTime, setWarmupTime] = useState(0);

    const startWatch = useCallback(() => {
        setIsRunning(true);
        playStartSound();
    }, [setIsRunning, playStartSound]);

    const stopWatch = useCallback(() => {
        setIsRunning(false);
        setIsLastTenSeconds(false);
        if (refInterval.current) {
            clearTimeout(refInterval.current);
        }
        setSeconds(0);
        setMinutes(minutesPerRound);
        setRounds(1);
    }, [minutesPerRound, refInterval]);

    const pauseWatch = useCallback(() => {
        setIsRunning(false);
        if (refInterval.current) {
            clearTimeout(refInterval.current);
        }
    }, [refInterval, setIsRunning]);

    const pauseOrStarWatch = useCallback(() => {
        if (isRunning) {
            pauseWatch();
            return;
        }

        startWatch();
    }, [isRunning, startWatch, pauseWatch]);

    const discount = useCallback(() => {
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        if (newSeconds < 0) {
            newMinutes -= 1;
            newSeconds = 59;
        }

        if (newMinutes === 0 && newSeconds <= 10 && !isBreakTime && !isLastTenSeconds) {
            setIsLastTenSeconds(true);
            playLastTenSecondsSound();
        }
        if (newMinutes < 0) {
            newSeconds = 0;
            setIsLastTenSeconds(false);
            if (isBreakTime) {
                newMinutes = minutesPerRound;
                setIsBreakTime(false);
                setRounds(rounds + 1);
                playStartSound();
            } else {
                playEndSound();
                if (rounds === maxRounds) {
                    stopWatch();
                }
                newMinutes = 1;
                setIsBreakTime(true);
            }

        }

        setMinutes(newMinutes);
        setSeconds(newSeconds);
    }, [seconds, minutes, isBreakTime, rounds, maxRounds, minutesPerRound, playStartSound, playEndSound, playLastTenSecondsSound, stopWatch, isLastTenSeconds]);

    function openSetup() {
        setIsSetupOpen(true);
    }

    function closeSetup() {
        setIsSetupOpen(false);
    }

    useEffect(() => {
        if (!isRunning) {
            return;
        }
        if (refInterval.current) {
            clearTimeout(refInterval.current);
        }
        refInterval.current = setTimeout(() => {
            discount();
        }, 150);
        return () => {
            if (refInterval.current) {
                clearTimeout(refInterval.current);
            }
        }
    }, [isRunning, seconds, minutes, discount]);

    useEffect(() => {
        // handle to close setup on pressing escape
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeSetup();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [closeSetup]);

    return {
        seconds,
        minutes,
        rounds,
        isRunning,
        isBreakTime,
        isLastTenSeconds,
        isSetupOpen,
        stopWatch,
        pauseOrStarWatch,
        openSetup,
        closeSetup,
        maxRounds,
        warmupTime,
        minutesPerRound,
        setMinutesPerRound,
        setWarmupTime,
        setMaxRounds,
        isSoundActive,
        toggleSound,
    }
};
