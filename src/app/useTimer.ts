import { useCallback, useEffect, useRef, useState } from "react";
import { SessionTime, State, useStatus } from "./useStatus";

const warningMinutes = 0;
const warningSeconds = 10;

export const useTimer = () => {


    const refInterval = useRef<NodeJS.Timeout | undefined>();
    const [minutesPerRound, setMinutesPerRound] = useState(2);
    const [prepareMinutes, setPrepareMinutes] = useState(0);
    const [prepareSeconds, setPrepareSeconds] = useState(30);
    const [breakMinutes, setBreakMinutes] = useState(1);
    const [breakSeconds, setBreakSeconds] = useState(0);
    const [secondsPerRound, setSecondsPerRound] = useState(0);
    const [maxRounds, setMaxRounds] = useState(3);
    const [rounds, setRounds] = useState(maxRounds);
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [elapsedMinutes, setElapsedMinutes] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [remainingMinutes, setRemainingMinutes] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    const calculateTotalTime = useCallback(() => {
        const totalSecondsPerRound = (minutesPerRound * 60) + secondsPerRound;
        const totalSecondsBreakTime = (breakMinutes * 60) + breakSeconds;
        const totalSecondsPrepareTime = (prepareMinutes * 60) + prepareSeconds;

        const totalSeconds = totalSecondsPerRound * maxRounds + totalSecondsBreakTime * (maxRounds - 1) + totalSecondsPrepareTime;

        const totalMinutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;

        return {
            totalMinutes,
            totalSeconds: remainingSeconds
        }
    }, [
        breakMinutes,
        breakSeconds,
        maxRounds,
        minutesPerRound,
        prepareMinutes,
        prepareSeconds,
        secondsPerRound,
    ]);
    const { totalMinutes, totalSeconds } = calculateTotalTime();

    const [minutes, setMinutes] = useState(totalMinutes);
    const [seconds, setSeconds] = useState(totalSeconds);

    const { status, isSoundActive, toggleSound, sessionTime, stopWatch, pauseOrStartWatch, setWorkTime, setBreakTime } = useStatus({
        minutes,
        seconds,
        warningMinutes,
        warningSeconds,
    });
    const pauseOrStartWatchInner = useCallback(() => {
        if (sessionTime === SessionTime.idle) {
            setMinutes(prepareMinutes);
            setSeconds(prepareSeconds);
        }
        pauseOrStartWatch();

    }, [pauseOrStartWatch, prepareMinutes, prepareSeconds, sessionTime]);

    const stopWatchInner = useCallback(() => {

        if (refInterval.current) {
            clearTimeout(refInterval.current);
        }
        stopWatch();
        const { totalMinutes, totalSeconds } = calculateTotalTime();
        setSeconds(totalSeconds);
        setMinutes(totalMinutes);
        setRounds(maxRounds);
    }, [calculateTotalTime, maxRounds, refInterval, stopWatch]);


    const manageTimer = useCallback((newMinutes: number, newSeconds: number) => {
        if (newMinutes < 0) {
            newSeconds = 0;
            if (sessionTime == SessionTime.prepareTime) {
                setWorkTime();
                setRounds(1);
                setMinutes(minutesPerRound);
                setSeconds(secondsPerRound);
                return;
            } else if (sessionTime == SessionTime.breakTime) {
                setWorkTime();
                newMinutes = minutesPerRound;
                newSeconds = secondsPerRound;
                setRounds(rounds + 1);
            } else {
                if (rounds === maxRounds) {
                    stopWatchInner();
                    return;
                }
                newMinutes = breakMinutes;
                newSeconds = breakSeconds;
                setBreakTime();
            }
        }

        setMinutes(newMinutes);
        setSeconds(newSeconds);
    }, [
        breakMinutes,
        breakSeconds,
        maxRounds,
        minutesPerRound,
        rounds,
        secondsPerRound,
        sessionTime,
        setBreakTime,
        setWorkTime,
        stopWatchInner,
    ]);

    const discount = useCallback(() => {
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        if (newSeconds < 0) {
            newMinutes -= 1;
            newSeconds = 59;
        }
        manageTimer(newMinutes, newSeconds);
    }, [
        manageTimer,
        minutes,
        seconds,
    ]);

    function openSetup() {
        setIsSetupOpen(true);
    }

    function closeSetup() {
        setIsSetupOpen(false);
        stopWatchInner();
    }

    useEffect(() => {
        if (refInterval.current) {
            clearTimeout(refInterval.current);
        }
        if (status !== State.running) {
            return;
        }
        refInterval.current = setTimeout(() => {
            discount();
        }, 50);
        return () => {
            if (refInterval.current) {
                clearTimeout(refInterval.current);
            }
        }
    }, [seconds, minutes, discount, status]);

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
        status,
        sessionTime,
        breakMinutes,
        breakSeconds,
        closeSetup,
        isSetupOpen,
        isSoundActive,
        maxRounds,
        minutes,
        minutesPerRound,
        openSetup,
        prepareMinutes,
        prepareSeconds,
        rounds,
        seconds,
        secondsPerRound,
        setBreakMinutes,
        setBreakSeconds,
        setMaxRounds,
        setMinutesPerRound,
        setPrepareMinutes,
        setPrepareSeconds,
        setSecondsPerRound,
        stopWatch: stopWatchInner,
        pauseOrStarWatch: pauseOrStartWatchInner,
        toggleSound,
        warningMinutes,
        warningSeconds,
        elapsedMinutes,
        elapsedSeconds,
        remainingMinutes,
        remainingSeconds,
        setElapsedMinutes,
        setElapsedSeconds,
        setRemainingMinutes,
        setRemainingSeconds,
    }
};
