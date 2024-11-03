import { useEffect, useState } from "react";
import { useAudio } from "./useAudio";

export enum State {
    stopped = "stopped",
    running = "running",
    paused = "paused",
}
export enum SessionTime {
    idle = "idle",
    prepareTime = "prepareTime",
    workTime = "workTime",
    warningTime = "warningTime",
    breakTime = "breakTime",
}

export const useStatus = ({ minutes, seconds, warningMinutes, warningSeconds }: { minutes: number; seconds: number; warningMinutes: number; warningSeconds: number }) => {
    const [status, setStatus] = useState<State>(State.stopped);
    const [sessionTime, setSessionTime] = useState<SessionTime>(SessionTime.idle);
    const { playEndSound, playStartSound, playLastTenSecondsSound, isSoundActive, toggleSound } = useAudio();

    const startWatch = () => {
        setStatus(State.running);
        setSessionTime(SessionTime.prepareTime);
    };

    const resumeWatch = () => {
        setStatus(State.running);
    };

    const stopWatch = () => {
        if (status === State.running) {
            playEndSound();
        }
        setStatus(State.stopped);
        setSessionTime(SessionTime.idle);
    };

    const pauseWatch = () => {
        setStatus(State.paused);
    };

    const pauseOrStartWatch = () => {
        if (status === State.running) {
            pauseWatch();
            return;
        }

        if (status === State.paused) {
            resumeWatch();
        }

        if (status === State.stopped) {
            startWatch();
        }
    };

    const setWorkTime = () => {
        setSessionTime(SessionTime.workTime);
        playStartSound();
    };

    const setBreakTime = () => {
        setSessionTime(SessionTime.breakTime);
        playEndSound();
    };

    useEffect(() => {
        if (status === State.running) {

            if (sessionTime === SessionTime.workTime && minutes <= warningMinutes && seconds <= warningSeconds) {
                setSessionTime(SessionTime.warningTime);
                playLastTenSecondsSound();
            }

        }

    }, [minutes, seconds, status, sessionTime, warningMinutes, warningSeconds, playLastTenSecondsSound, playStartSound, playEndSound]);

    return {
        status,
        sessionTime,
        stopWatch,
        pauseOrStartWatch,
        setWorkTime,
        setBreakTime,
        isSoundActive,
        toggleSound,
    };
}