<script>
    function takeInput(e) {
        e.target.value = e.target.value.replaceAll(/\D/gi, "");
        if (e.target.value.length == 7) {
            e.target.value = e.target.value.slice(1)
            realInput.selectionEnd = e.target.value.length - selectPosition
        }
       
        e.target.value = "000000".slice(0, 6 - e.target.value.length) + e.target.value;
     
        hours = e.target.value.slice(0, 2);
        minutes = e.target.value.slice(2, 4);
        seconds = e.target.value.slice(4, 6);
    }
    function moveSelect() {
        selectPosition = realInput.value.length - realInput.selectionEnd;
        if (selectPosition == 6) {
            selectPosition = 5;
            realInput.selectionEnd = 1
        }
    }

    let hours = "00";
    let minutes = "00";
    let seconds = "00";
    /**
     * @type {HTMLInputElement}
     */
    let realInput;
    let selectPosition = -1;
</script>


<div class="thing">
    <input bind:this={realInput} class="realInput" on:keyup={moveSelect} on:input={takeInput}  value="000000" type="text" maxlength="7" />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:focus={() => realInput.focus()} on:click={() => {realInput.focus(); selectPosition = 0; realInput.selectionEnd = realInput.value.length}}  class="fakeInput">
        <div><span class="{selectPosition == 5 ? "selected":""}">{hours[0]}</span><span class="{selectPosition == 4 ? "selected" : ""}">{hours[1]}</span><span class="smol">h</span></div>
        <div><span class="{selectPosition == 3 ? "selected":""}">{minutes[0]}</span><span class="{selectPosition == 2 ? "selected" : ""}">{minutes[1]}</span><span class="smol">m</span></div>
        <div><span class="{selectPosition == 1 ? "selected":""}">{seconds[0]}</span><span class="{selectPosition == 0 ? "selected" : ""}">{seconds[1]}</span><span class="smol">s</span></div>
    </div>
</div>

<style>
    .selected {
        position: relative;
    }
    .selected::after {
        content: "";
        position: absolute;
        top: 50%;
        translate: 0 -50%;
        right: -0.2px;
        height: 90%;
        border-right: 1px solid hsl(219, 13%, 69%);
        animation: wut 1000ms linear infinite;
    }
    @keyframes wut {
        0% {
            opacity: 100%;
        }
        60% {
            opacity: 100%;
        }
        61% {
            opacity: 0;
        }
        100% {
            opacity: 0%;
        }
    }



    .realInput {
        opacity: 0;
        position: absolute;
        top: 0;
        z-index: -1;
        opacity: 0;
        width: 0;
    }
    .realInput:focus + .fakeInput {
        outline-offset: 1.5px;
        outline: 2px solid hsla(219, 13%, 69%, 0.301);
    }

    .smol {
        font-weight: normal;
        font-size: 0.7rem;
    }
    .fakeInput {
        display: flex;
        gap: 0.3ch;
        padding: 0.25em;
        width: 6.5em;
        justify-content: center;
        border-radius: 0.25em;
        border: 1px solid hsla(219, 13%, 69%, 0.292);
    }
    .thing {
        position: relative;
        width: fit-content;
    }
</style>
