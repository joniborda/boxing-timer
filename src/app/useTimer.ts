import { useCallback, useEffect, useRef, useState } from "react";
import { SessionTime, State, useStatus } from "./useStatus";

const warningMinutes = 0;
const warningSeconds = 10;

export const useTimer = () => {


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
    const [isSetupOpen, setIsSetupOpen] = useState(false);
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
        stopWatch();
        if (refInterval.current) {
            clearTimeout(refInterval.current);
        }
        setSeconds(0);
        setMinutes(minutesPerRound);
        setRounds(1);
    }, [minutesPerRound, refInterval, stopWatch]);


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
                    stopWatch();
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
        stopWatch,
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
        stopWatch();
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
        }, 100);
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
    }
};
