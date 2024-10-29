'use client'
import { useCLock } from "./useClock";
import { useTimer } from "./useTimer";

function Timer() {

    const {
        clockHours,
        clockMinutes,
        isPM,
    } = useCLock();

    const {
        seconds,
        minutes,
        rounds,
        isRunning,
        isBreakTime,
        isLastTenSeconds,
        openSetup,
        isSetupOpen,
        stopWatch,
        pauseOrStarWatch,
        warmupTime,
        minutesPerRound,
        maxRounds,
    } = useTimer();


    return (
        <main>
            <section className="flex flex-col justify-center items-center gap-4">
                <div className="text-2xl md:text-5xl lg:text-[8rem] font-mono">
                    <div>
                        {clockHours < 10 ? "0" + clockHours : clockHours}:{clockMinutes < 10 ? "0" + clockMinutes : clockMinutes}
                        {isPM ? "PM" : "AM"}
                    </div>
                </div>
                <div>
                    <div className="text-xl lg:text-[2rem] font-mono bg-white text-black inline-block rounded-xl rounded-br-none rounded-bl-none p-4">
                        Round {rounds}
                    </div>
                    <div className={`text-[30vw] font-mono rounded-3xl rounded-tl-none px-8 ${isBreakTime ? "bg-red-500" : isLastTenSeconds ? "bg-yellow-500" : "bg-green-700"}`} style={{ lineHeight: "1" }}>
                        {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}
                    </div>
                    <div className="flex flex-row justify-center">
                        <button
                            className="py-4 px-6 bg-white text-black text-2xl"
                            onClick={() => {
                                pauseOrStarWatch();
                            }}>
                            {isRunning ? "Pause" : "Start"}
                        </button>
                        <button
                            className="py-4 px-6 bg-white text-black text-2xl"
                            onClick={() => { stopWatch() }}>
                            Stop
                        </button>
                        <button
                            className="py-4 px-6 bg-white text-black text-2xl"
                            onClick={() => { openSetup() }}>
                            Setup
                        </button>
                    </div>
                </div>
            </section>
            <section className={`mt-4 ${isSetupOpen ? "" : "hidden"}`}>
                <label htmlFor="rounds_input">Rounds</label>
                <input id="rounds_input" type="number" value={maxRounds} onChange={() => { }} />

                <label htmlFor="time_per_round_input">Time per round</label>
                <input id="time_per_round_input" type="number" value={minutesPerRound} onChange={() => { }} />

                <label htmlFor="time_per_round_input">Warm-up time</label>
                <input id="time_per_round_input" type="number" value={warmupTime} onChange={() => { }} />
            </section>
        </main>
    );
}

export default Timer;