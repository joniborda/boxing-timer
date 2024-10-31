import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "./useAudio";

const warningMinutes = 0;
const warningSeconds = 10;

export const useTimer = () => {
    const { playEndSound, playStartSound, playLastTenSecondsSound, isSoundActive, toggleSound } = useAudio();

    const refInterval = useRef<NodeJS.Timeout | undefined>();
    const [rounds, setRounds] = useState(1);
    const [minutesPerRound, setMinutesPerRound] = useState(2);
    const [prepareMinutes, setPrepareMinutes] = useState(0);
    const [prepareSeconds, setPrepareSeconds] = useState(30);
    const [breakMinutes, setBreakMinutes] = useState(1);
    const [breakSeconds, setBreakSeconds] = useState(0);
    const [secondsPerRound, setSecondsPerRound] = useState(0);
    const [minutes, setMinutes] = useState(prepareMinutes + (minutesPerRound * rounds) + (1 * rounds));
    const [seconds, setSeconds] = useState(0);
    const [maxRounds, setMaxRounds] = useState(3);
    const [isRunning, setIsRunning] = useState(false);
    const [isStopped, setIsStopped] = useState(true);
    const [isBreakTime, setIsBreakTime] = useState(false);
    const [isPrepareTime, setIsPrepareTime] = useState(false);
    const [isLastTenSeconds, setIsLastTenSeconds] = useState(false);
    const [isSetupOpen, setIsSetupOpen] = useState(false);

    const startWatch = useCallback(() => {
        setIsRunning(true);
        setIsPrepareTime(true);
        setIsBreakTime(false);
        setIsStopped(false);
        setMinutes(prepareMinutes);
        setSeconds(prepareSeconds);

    }, [setIsRunning, playStartSound]);

    const resumeWatch = useCallback(() => {
        setIsRunning(true);
    }, [setIsRunning]);

    const stopWatch = useCallback(() => {
        setIsRunning(false);
        setIsLastTenSeconds(false);
        if (refInterval.current) {
            clearTimeout(refInterval.current);
        }
        setSeconds(0);
        setMinutes(minutesPerRound);
        setRounds(1);
        setIsStopped(true);
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
        if (isStopped) {
            startWatch();
            return;
        }

        resumeWatch();
    }, [isRunning, startWatch, pauseWatch]);

    const discount = useCallback(() => {
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        if (newSeconds < 0) {
            newMinutes -= 1;
            newSeconds = 59;
        }
        
        if (newMinutes === 0 && newSeconds <= 10 && !isBreakTime && !isLastTenSeconds && !isPrepareTime) {
            setIsLastTenSeconds(true);
            playLastTenSecondsSound();
        }
        if (newMinutes < 0) {
            newSeconds = 0;
            setIsLastTenSeconds(false);
            if (isPrepareTime) {
                setIsPrepareTime(false);
                setRounds(1);
                setMinutes(minutesPerRound);
                setSeconds(secondsPerRound);
                playStartSound();
                return;
            }
            if (isBreakTime) {
                newMinutes = minutesPerRound;
                newSeconds = secondsPerRound;
                setIsBreakTime(false);
                setRounds(rounds + 1);
                playStartSound();
            } else {
                if (rounds === maxRounds) {
                    stopWatch();
                }
                newMinutes = breakMinutes;
                newSeconds = breakSeconds;
                setIsBreakTime(true);
                playEndSound();
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
        stopWatch();
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
        }, 1000);
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

            if (event.key === "Enter") {
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
        prepareMinutes,
        minutesPerRound,
        setMinutesPerRound,
        setPrepareMinutes,
        setPrepareSeconds,
        setBreakMinutes,
        setBreakSeconds,
        setMaxRounds,
        isSoundActive,
        toggleSound,
        isPrepareTime,
        prepareSeconds,
        secondsPerRound,
        setSecondsPerRound,
        breakMinutes,
        breakSeconds,
        warningMinutes,
        warningSeconds,
    }
};
