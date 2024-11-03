'use client'
import { useCLock } from "./useClock";
import { SessionTime, State } from "./useStatus";
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
        openSetup,
        closeSetup,
        isSetupOpen,
        stopWatch,
        pauseOrStarWatch,
        minutesPerRound,
        maxRounds,
        setMaxRounds,
        setPrepareMinutes,
        setPrepareSeconds,
        setMinutesPerRound,
        isSoundActive,
        toggleSound,
        status,
        sessionTime,
        prepareMinutes,
        prepareSeconds,
        secondsPerRound,
        setSecondsPerRound,
        warningMinutes,
        warningSeconds,
        breakMinutes,
        breakSeconds,
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
                        className={`overflow-hidden text-center font-bold text-[10vw] md:text-[20rem] p-4 rounded-3xl ${SessionTime.breakTime === sessionTime ?
                            "bg-[#ea1e0d]" :
                            SessionTime.prepareTime === sessionTime ?
                                "bg-[#e2dc07]" :
                                SessionTime.warningTime === sessionTime ?
                                    "bg-[#ff6707]" : "bg-[#106e0c]"
                            }`}
                        style={{
                            lineHeight: "1",
                            letterSpacing: "-.04em",
                        }}>
                        {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col justify-center items-center rounded-3xl p-4 bg-[#202022]">
                        <div className="text-[#e2dc07] text-4xl font-bold">
                            {prepareMinutes < 10 ? "0" + prepareMinutes : prepareMinutes}:{prepareSeconds < 10 ? "0" + prepareSeconds : prepareSeconds}
                        </div>
                        <div className="text-sm text-[#868688]">
                            PREPARE
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center rounded-3xl p-4 bg-[#202022]">
                        <div className="text-[#106e0c] text-4xl font-bold">
                            {minutesPerRound < 10 ? "0" + minutesPerRound : minutesPerRound}:{secondsPerRound < 10 ? "0" + secondsPerRound : secondsPerRound}
                        </div>
                        <div className="text-sm text-[#868688]">
                            ROUND
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center rounded-3xl p-4 bg-[#202022]">
                        <div className="text-[#ff6707] text-4xl font-bold">
                            {warningMinutes < 10 ? "0" + warningMinutes : warningMinutes}:{warningSeconds < 10 ? "0" + warningSeconds : warningSeconds}
                        </div>
                        <div className="text-sm text-[#868688]">
                            WARNING
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center rounded-3xl p-4 bg-[#202022]">
                        <div className="text-[#ea1e0d] text-4xl font-bold">
                            {breakMinutes < 10 ? "0" + breakMinutes : breakMinutes}:{breakSeconds < 10 ? "0" + breakSeconds : breakSeconds}
                        </div>
                        <div className="text-sm text-[#868688]">
                            REST
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-row justify-center gap-4">
                        <button
                            className="py-2 sm:py-4 px-4 sm:px-6 bg-white text-black text-base md:text-2xl rounded-lg"
                            onClick={() => {
                                pauseOrStarWatch();
                            }}>
                            {status === State.running ? "Pause" : "Start"}
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
                    >
                        X
                    </button>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="rounds_input" className="text-base md:text-xl lg:text-2xl">Rounds</label>
                        <input
                            className="border-none rounded-3xl text-center bg-white text-black text-xl md:text-2xl lg:text-[5rem] p-4 w-10 h-10 md:w-20 md:h-20 lg:w-40 lg:h-40"
                            id="rounds_input"
                            name="rounds_input"
                            type="number"
                            value={maxRounds}
                            onChange={(e) => { setMaxRounds(parseInt(e.target.value)) }}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="time_per_round_input" className="text-base md:text-xl lg:text-2xl">Time per round</label>
                        <div className="flex flex-row items-center">
                            <input
                                className="border-none rounded-3xl text-center bg-white text-black text-xl md:text-2xl lg:text-[5rem] p-4 w-10 h-10 md:w-20 md:h-20 lg:w-40 lg:h-40"
                                id="time_per_round_input"
                                name="time_per_round_input"
                                type="number"
                                value={minutesPerRound}
                                onChange={(e) => { setMinutesPerRound(parseInt(e.target.value)) }}
                            />
                            <span className="text-xl md:text-2xl lg:text-[5rem]">
                                :
                            </span>
                            <input
                                className="border-none rounded-3xl text-center bg-white text-black text-xl md:text-2xl lg:text-[5rem] p-4 w-10 h-10 md:w-20 md:h-20 lg:w-40 lg:h-40"
                                id="time_per_round_input"
                                name="time_per_round_input"
                                type="number"
                                value={secondsPerRound}
                                onChange={(e) => { setSecondsPerRound(parseInt(e.target.value)) }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="time_per_round_input" className="text-base md:text-xl lg:text-2xl">Prepare time</label>
                        <div className="flex flex-row items-center">
                            <input
                                className="border-none rounded-3xl text-center bg-white text-black text-xl md:text-2xl lg:text-[5rem] p-4 w-10 h-10 md:w-20 md:h-20 lg:w-40 lg:h-40"
                                id="time_per_round_input"
                                name="time_per_round_input"
                                type="number"
                                value={prepareMinutes}
                                onChange={(e) => { setPrepareMinutes(parseInt(e.target.value)) }}
                            />
                            <span className="text-xl md:text-2xl lg:text-[5rem]">
                                :
                            </span>
                            <input
                                className="border-none rounded-3xl text-center bg-white text-black text-xl md:text-2xl lg:text-[5rem] p-4 w-10 h-10 md:w-20 md:h-20 lg:w-40 lg:h-40"
                                id="time_per_round_input"
                                name="time_per_round_input"
                                type="number"
                                value={prepareSeconds}
                                onChange={(e) => { setPrepareSeconds(parseInt(e.target.value)) }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Timer;