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
        closeSetup,
        isSetupOpen,
        stopWatch,
        pauseOrStarWatch,
        warmupTime,
        minutesPerRound,
        maxRounds,
        setMaxRounds,
        setWarmupTime,
        setMinutesPerRound,
        isSoundActive,
        toggleSound,
    } = useTimer();


    return (
        <main>
            <section className="flex flex-col justify-center items-center gap-4 p-4">
                <div className="text-2xl md:text-5xl lg:text-[8rem] font-bold">
                    <div>
                        {clockHours < 10 ? "0" + clockHours : clockHours}:{clockMinutes < 10 ? "0" + clockMinutes : clockMinutes}
                        <span className="text-base md:text-3xl">
                            {isPM ? "PM" : "AM"}
                        </span>
                    </div>
                </div>

                <div className="w-full m-auto flex flex-row justify-center gap-4">
                    <div className="bg-white rounded-xl p-2 md:p-4 text-center">
                        <span className="text-center text-[#ea1e0d] text-2xl font-bold">ROUNDS</span>
                        <div className="text-[20rem] text-black font-bold"
                            style={{
                                lineHeight: "1",
                                letterSpacing: "-.04em",
                            }}>
                            {rounds < 10 ? "0" + rounds : rounds}
                        </div>
                    </div>
                    <div
                        className={`overflow-hidden text-center font-bold text-[10vw] md:text-[20rem] p-4 rounded-3xl ${isBreakTime ? "bg-[#ea1e0d]" : isLastTenSeconds ? "bg-[#e2dc07]" : "bg-[#106e0c]"}`}
                        style={{
                            lineHeight: "1",
                            letterSpacing: "-.04em",
                        }}>
                        {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}
                    </div>
                </div>
                <div>
                    <div className="flex flex-row justify-center gap-4">
                        <button
                            className="py-2 sm:py-4 px-4 sm:px-6 bg-white text-black text-base md:text-2xl rounded-lg"
                            onClick={() => {
                                pauseOrStarWatch();
                            }}>
                            {isRunning ? "Pause" : "Start"}
                        </button>
                        <button
                            className="py-2 sm:py-4 px-4 sm:px-6 bg-white text-black text-base md:text-2xl rounded-lg"
                            onClick={() => { stopWatch() }}>
                            Stop
                        </button>
                        <button
                            className="py-2 sm:py-4 px-4 sm:px-6 bg-white text-black text-base md:text-2xl rounded-lg"
                            onClick={() => { openSetup() }}>
                            Setup
                        </button>
                        <button
                            className="py-2 sm:py-4 px-4 sm:px-6 bg-white text-black text-base md:text-2xl rounded-lg"
                            onClick={() => toggleSound()}>
                            {isSoundActive ? "Sound On" : "Sound Off"}
                        </button>
                    </div>
                </div>
            </section>
            <section className={`backdrop fixed top-0 left-0 w-full h-full bg-black bg-opacity-50  ${isSetupOpen ? "" : "hidden"}`}>
                <div className="bg-black w-full h-full flex flex-col md:flex-row justify-center items-center gap-4">
                    <button
                        className="py-4 px-6 bg-white text-black text-2xl absolute top-0 right-0"
                        onClick={() => { closeSetup(); }}
                    >X
                    </button>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="rounds_input" className="text-base md:text-xl lg:text-2xl">Rounds</label>
                        <input
                            className="border-none rounded-3xl text-center bg-white text-black text-6xl md:text-9xl lg:text-[15rem] p-4 w-20 h-20 md:w-44 md:h-44 lg:w-80 lg:h-80"
                            id="rounds_input"
                            name="rounds_input"
                            type="number"
                            value={maxRounds}
                            onChange={(e) => { setMaxRounds(parseInt(e.target.value)) }}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="time_per_round_input" className="text-base md:text-xl lg:text-2xl">Time per round</label>
                        <input
                            className="border-none rounded-3xl text-center bg-white text-black text-6xl md:text-9xl lg:text-[15rem] p-4 w-20 h-20 md:w-44 md:h-44 lg:w-80 lg:h-80"
                            id="time_per_round_input"
                            name="time_per_round_input"
                            type="number"
                            value={minutesPerRound}
                            onChange={(e) => { setMinutesPerRound(parseInt(e.target.value)) }}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="warmup_input" className="text-base md:text-xl lg:text-2xl">Warm-up time</label>
                        <input
                            className="border-none rounded-3xl text-center bg-white text-black text-6xl md:text-9xl lg:text-[15rem] p-4 w-20 h-20 md:w-44 md:h-44 lg:w-80 lg:h-80"
                            id="warmup_input"
                            name="warmup_input"
                            type="number"
                            value={warmupTime}
                            onChange={(e) => { setWarmupTime(parseInt(e.target.value)) }}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Timer;