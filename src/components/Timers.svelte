<script lang="ts">
    function handleClick() {
        console.log(timers[0].timeLeftSeconds);
    }
    import { onMount } from "svelte";
    import TimeInput from "./TimeInput.svelte";

    type timer = {
        createdAt: Date;
        reminder: string;
        intervalInSeconds: number;
        timeLeftSeconds: number;
        active: boolean;
    };

    function formatTimeLeft(timeAmt) {
        const hours = Math.floor(timeAmt / 3600);
        const minutes = Math.floor(timeAmt / 60);
        const seconds = timeAmt % 60;

        return `${hours}h:${minutes}m:${seconds}s`;
    }
    let currentTime: Date | number;

    onMount(() => {
        currentTime = Date.now();
        const timer = setInterval(() => {
            const activeTimers = timers.filter((timer) => timer.active);
            if (activeTimers.length > 0) {
                timers = activeTimers.map((timer) => {
                    return {
                        ...timer,
                        timeLeftSeconds: (timer.timeLeftSeconds -= 1),
                    };
                });
                console.log("tset");
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    });
    function delTimer(id) {
        timers = timers.filter((timer) => timer.createdAt != id);
    }
    let timers: Array<timer> = [
        {
            reminder: "test",
            createdAt: new Date(Date.now()),
            intervalInSeconds: 500,
            active: false,
            timeLeftSeconds: 600,
        },
    ];
</script>

<div class="my_table">
    <div class="titles grid row">
        <h3>Reminder</h3>
        <h3>Interval</h3>
        <h3>Time Left</h3>
        <h3>Status</h3>
        <h3>Del</h3>
    </div>
    <ul>
        {#each timers as timer (timer.createdAt)}
            <div class="row grid items-center">
                <h4>{timer.reminder}</h4>
                <div>
                    <h4 class="mobile-visible">Interval</h4>
                    <span>{timer.intervalInSeconds / 100}</span>
                </div>
                <div>
                    <h4 class="mobile-visible">Time Left</h4>
                    <p>
                        {Math.floor(timer.timeLeftSeconds / 3600)}<span
                            class="text-sm">h</span
                        >
                        {Math.floor(timer.timeLeftSeconds / 60)}<span
                            class="text-sm">m</span
                        >
                        {timer.timeLeftSeconds % 60}<span class="text-sm"
                            >s</span
                        >
                    </p>
                </div>
                <div class="flex">
                    <h4 class="mobile-visible">Status</h4>
                    <label class="swap">
                        <input
                            type="checkbox"
                            name="activeTimer"
                            bind:checked={timer.active}
                        />
                        <p class="swap-on">Playing</p>
                        <p class="swap-off">Paused</p>
                    </label>
                </div>

                <div>
                    <h4 class="mobile-visible">Del</h4>
                    <button on:click={delTimer(timer.createdAt)} class="del-btn"
                        >&times;</button
                    >
                </div>
            </div>
        {/each}
    </ul>
</div>

<form id="add-reminder-form">
    <label for="reminder">Name:</label>
    <input
        class="input input-bordered"
        type="text"
        name="reminder"
        id="reminder"
        maxlength="20"
    />

    <label for="interval">Timer Interval: </label>
    <TimeInput/>
</form>





<style>
    #add-reminder-form {
        display: flex;
        align-items: center;
    }
    .titles {
        font-weight: bolder;
        color: rgb(143, 217, 246);
        background-color: rgb(26, 38, 48);
    }

    .my_table {
        margin: 1em;
        border-radius: 0.5em;
        overflow: hidden;
        /* padding: 1em; */
        background-color: rgb(25, 46, 64);
        border: 1px solid rgb(171, 187, 197);
    }
    .my_table .del-btn {
        border-radius: 0.25em;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 0, 0, 0.366);
        aspect-ratio: 1/1;
        height: 2ch;
    }

    .row > * {
        border: 2px solid rgb(171, 187, 197);
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0.25em;
    }
    .row {
        width: 100%;
        grid-template-columns: 14em 1fr 1fr 5em 3em;
    }

    .mobile-visible {
        display: none;
    }
</style>
