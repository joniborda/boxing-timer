'use client'

import { useEffect, useRef, useState } from "react";
import { useCLock } from "./useClock";
import useSound from 'use-sound';

function Timer() {

    const {
        clockHours,
        clockMinutes,
    } = useCLock();

    const urlSoundEnd = "/gong.ogg";
    const [playSoundEnd] = useSound(urlSoundEnd);

    const [seconds, setSeconds] = useState(0);
    const [maxMinutes, setMaxMinutes] = useState(2);
    const [minutes, setMinutes] = useState(maxMinutes);
    const [rounds, setRounds] = useState(1);
    const [maxRounds, setMaxRounds] = useState(3);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreakTime, setIsBreakTime] = useState(false);
    const [isLastMinute, setIsLastMinute] = useState(false);


    const refInterval = useRef<NodeJS.Timeout | undefined>();

    function discount() {
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        if (newSeconds < 0) {
            newMinutes -= 1;
            newSeconds = 59;
        }
        if (newMinutes === 0 && !isBreakTime) {
            setIsLastMinute(true);
        } else {
            setIsLastMinute(false);
        }
        if (newMinutes < 0) {
            newSeconds = 0;
            if (isBreakTime) {
                newMinutes = maxMinutes;
                setIsBreakTime(false);
                setRounds(rounds + 1);
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
    }
    function startWatch() {
        setIsRunning(true);

    }

    function stopWatch() {
        setIsRunning(false);
        if (refInterval.current) {
            clearTimeout(refInterval.current);
        }
        setSeconds(0);
        setMinutes(maxMinutes);
        setRounds(1);
    }

    function pauseWatch() {
        setIsRunning(false);
        if (refInterval.current) {
            clearTimeout(refInterval.current);
        }
    }

    function playEndSound() {
        playSoundEnd
    }

    function playSound(url: string) {
        const audio = new Audio(url);
        audio.play();
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
        }, 100);

        return () => {
            if (refInterval.current) {
                clearTimeout(refInterval.current);
            }
        }
    }, [isRunning, seconds, minutes]);

    return (
        <main>
            <section className="flex flex-col justify-center items-center gap-4">
                <div className="text-2xl md:text-5xl lg:text-[8rem] font-mono">
                    <div>
                        {clockHours < 10 ? "0" + clockHours : clockHours}:{clockMinutes < 10 ? "0" + clockMinutes : clockMinutes}
                    </div>
                </div>
                <div>
                    <div className="text-xl lg:text-[2rem] font-mono bg-white text-black inline-block rounded-xl rounded-br-none rounded-bl-none p-4">
                        Round {rounds}
                    </div>
                    <div className={`text-[30vw] font-mono rounded-3xl rounded-tl-none px-4 ${isBreakTime ? "bg-red-500" : isLastMinute ? "bg-yellow-500" : "bg-green-700"}`} style={{ lineHeight: "1" }}>
                        {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}
                    </div>
                    <div className="flex flex-row justify-center">
                        <button
                            className="py-4 px-6 bg-white text-black text-2xl"
                            onClick={() => {
                                if (isRunning) {
                                    pauseWatch();
                                } else {
                                    startWatch()
                                }
                            }}>
                            {isRunning ? "Pause" : "Start"}
                        </button>
                        <button
                            className="py-4 px-6 bg-white text-black text-2xl"
                            onClick={() => { stopWatch() }}>
                            Stop
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Timer;