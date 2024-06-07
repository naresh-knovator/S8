(async () => {
    try {
        const { dicoogleClient } = await import("dicoogle-client");
        const dicoogle = dicoogleClient("localhost:3000");
        // if required, login to the system before using
        dicoogle.login("admin", "mysecretpassword", function (error, outcome) {
            if (error) {
                console.error(error);
                return;
            }

            // Ok! Start using Dicoogle!
            dicoogle.search(
                "PatientName:Pinho^Eduardo",
                { provider: "lucene" },
                (error, outcome) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    // use outcome
                    const { elapsedTime, results } = outcome;
                    // ...
                }
            );
        });
    } catch (error) {
        console.error("Error loading dicoogle-client:", error);
    }
})();
