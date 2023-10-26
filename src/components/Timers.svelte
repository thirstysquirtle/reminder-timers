<script lang="ts">
    import { onMount, tick } from "svelte";
    import TimeInput from "./TimeInput.svelte";

    function formatTime(timeAmt: number): string {
        let hours: any = Math.floor(timeAmt / 3600);
        const minutes = Math.floor((timeAmt / 60)%60);
        const seconds = timeAmt % 60 == 0 ? "00" : timeAmt % 60;
        hours = hours == 0 ? "" : `${hours}<span class="text-sm">h</span>&nbsp;`;

        return `${hours}${minutes}<span class="text-sm">m</span>&nbsp;${seconds}<span class="text-sm">s</span>`;
    }

    let currentTime: Date | number;

    let notifSound;
    const notificationOptions: NotificationOptions = {
        icon: "/repeating-timers/catCri2.jpg",
        vibrate: [100, 100],
        image: "/repeating-timers/catCri2.jpg",
        badge: "/repeating-timers/catCri2.jpg",
    };

    function setupNotifications() {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission == "granted") {
            notifSound = new Audio("/repeating-timers/short-success-sound-glockenspiel-treasure-video-game-6346.mp3");
            notifPermission = true;
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission == "granted") {
                    notifSound = new Audio("/repeating-timers/short-success-sound-glockenspiel-treasure-video-game-6346.mp3");
                    notifPermission = true;
                } else {
                    notifPermission = false;
                }
            });
        }
    }
    let notifPermission = false;
    let timersCache;
    onMount(() => {
        setupNotifications();
        currentTime = Date.now();

        const decrementWorker = new Worker("/repeating-timers/worker.js");
        timersCache = timers;
        let notificationQueue = [];
        decrementWorker.onmessage = async (e) => {
            timers = timersCache;
            for (const { title, options } of notificationQueue) {
                new Notification(title, options).onclick = function (event) {
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    window.focus(); // focus the window or tab that created the notification
                };
                notifSound.currentTime = 0;
                notifSound.play();
            }
            notificationQueue = [];
            tick();
            timersCache = timers.map((timer) => {
                if (timer.active) {
                    timer.timeLeftSeconds -= 1;
                    if (timer.timeLeftSeconds < 0) {
                        timer.timeLeftSeconds = timer.intervalInSeconds;
                        timer.count += 1;
                        if (Notification.permission == "granted") {
                            notificationQueue.push({
                                title: timer.reminder,
                                options: { ...notificationOptions, body: `${new Date(Date.now()).toLocaleString()}` },
                            });
                        }
                    }
                }
                return timer;
            });
        };
    });
    function delTimer(id) {
        timers = timersCache = timersCache.filter((timer) => timer.createdAt != id);
    }

    type timer = {
        createdAt: Date;
        reminder: string;
        intervalInSeconds: number;
        timeLeftSeconds: number;
        active: boolean;
        count: number;
    };

    let timers: Array<timer> = [
        {
            reminder: "20-20-20",
            createdAt: new Date(Date.now()),
            intervalInSeconds: 1320,
            active: true,
            timeLeftSeconds: 1320,
            count: 0,
        },
        {
            reminder: "Blink",
            createdAt: new Date(Date.now()),
            intervalInSeconds: 270,
            active: true,
            timeLeftSeconds: 270,
            count: 0,
        },
        {
            reminder: "Ultradian Cycle",
            createdAt: new Date(Date.now()),
            intervalInSeconds: 5700,
            active: true,
            timeLeftSeconds: 5700,
            count: 0,
        },
    ];
    function unformatTime(hhmmss: string): number {
        const hours: number = Number(hhmmss.slice(0, 2)) * 3600;
        const minutes: number = Number(hhmmss.slice(2, 4)) * 60;
        const seconds: number = Number(hhmmss.slice(4, 6));

        return hours + minutes + seconds;
    }

    function addTimer(e) {
        const formDat = new FormData(e.target);
        const timeInSecs = unformatTime(formDat.get("time").toString());
        timers = timersCache = [
            ...timersCache,
            {
                reminder: formDat.get("reminder").toString(),
                createdAt: new Date(Date.now()),
                active: true,
                intervalInSeconds: timeInSecs,
                timeLeftSeconds: timeInSecs,
                count: 0,
            },
        ];
    }
</script>

<h2 class="flex justify-center m-2 font-bold">Repeating Timers</h2>
<div class="my_table">
    <div class="titles grid row">
        <h3>Reminder</h3>
        <h3>Interval</h3>
        <h3>Time Left</h3>
        <h3 class="text-sm">Count</h3>
        <h3>Status</h3>
        <h3 class="text-sm">Del</h3>
    </div>
    <ul>
        {#each timers as timer (timer.createdAt)}
            <div class="row grid items-center">
                <h4>{timer.reminder}</h4>
                <div>
                    <h4 class="mobile-visible">Interval</h4>
                    <span>{@html formatTime(timer.intervalInSeconds)}</span>
                </div>
                <div>
                    <h4 class="mobile-visible">Time Left</h4>
                    <span>{@html formatTime(timer.timeLeftSeconds)}</span>
                    <!-- <p>
                        {Math.floor(timer.timeLeftSeconds / 3600)}<span class="text-sm">h</span>
                        {Math.floor(timer.timeLeftSeconds / 60)}<span class="text-sm">m</span>
                        {timer.timeLeftSeconds % 60}<span class="text-sm">s</span>
                    </p> -->
                </div>
                <div>
                    <h4 class="mobile-visible">Count</h4>
                    <p>{timer.count}</p>
                </div>
                <div class="flex">
                    <h4 class="mobile-visible">Status</h4>
                    <label class="swap">
                        <input type="checkbox" name="activeTimer" bind:checked={timer.active} />
                        <div class="rounded border-2 px-1 border-slate-300 bg-green-700 swap-on">Ticking</div>
                        <div class="rounded border-2 px-1 border-slate-300 bg-slate-700 swap-off">Paused</div>
                    </label>
                </div>

                <div>
                    <h4 class="mobile-visible">Del</h4>
                    <button on:click={delTimer(timer.createdAt)} class="del-btn">&times;</button>
                </div>
            </div>
        {/each}
    </ul>

    <form id="add-reminder-form" class="gap-2 justify-center m-2" on:submit|preventDefault={addTimer}>
        <label for="reminder">Name:</label>
        <input type="text" name="reminder" id="reminder" />

        <label for="time">Timer Interval: </label>
        <TimeInput id={"time"} />
        <button class="rounded-sm border-2 px-1 border-slate-300 bg-sky-600" type="submit"> Add ↑ </button>
    </form>
</div>
{#if notifSound}
    <div class="flex gap-2 mx-5">
        <h3>Volume:</h3>
        <input
            on:mouseup={() => {
                notifSound.currentTime = 0;
                notifSound.play();
            }}
            bind:value={notifSound.volume}
            type="range"
            min="0.00"
            max="1.00"
            step="0.01"
        />
    </div>
{/if}
{#if !notifPermission}
    <p class="w-full flex justify-center text-2xl">You might want to allow notifications</p>
{/if}

<style>
    input[type="text"]:focus {
        outline-offset: 1.5px;
        outline: 2px solid hsla(219, 13%, 69%, 0.301);
    }

    input[type="text"] {
        margin: 0 0.25em;
        background-color: rgb(26, 38, 48);
        padding: 0.1em 0.25em;
        width: 22ch;
        border-radius: 0.25em;
        border: 1px solid hsla(219, 13%, 69%, 0.292);
    }

    #add-reminder-form {
        display: flex;
        align-items: center;
        height: fit-content;
        padding: 0.25em;
    }
    .titles {
        font-weight: bolder;
        color: rgb(143, 217, 246);
        background-color: rgb(26, 38, 48);
    }

    .my_table {
        margin: 0 1em;
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
        padding: 0.35rem;
    }
    .row {
        width: 100%;
        grid-template-columns: minmax(14em, 1.25fr) 1fr 1fr 3em 5em 3em;
        word-break: break-all;
    }

    .mobile-visible {
        display: none;
    }
</style>
