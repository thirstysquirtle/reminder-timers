
onmessage = (e) => {
    setTimeout(() => {
        console.log(e.data)
        postMessage(e.data.map((timer) => {
            if (timer.active) {
                timer.timeLeftSeconds -= 1;
                if (timer.timeLeftSeconds < 0) {
                    timer.timeLeftSeconds = timer.intervalInSeconds;
                    timer.count += 1;
                    if (Notification.permission == "granted") {
                        new Notification(
                            timer.reminder,
                            notificationOptions
                        );

                    }
                }
            }
            return timer;
        })

        );
    }, 1000);
}