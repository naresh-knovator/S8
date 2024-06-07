(async () => {
    try {
        const { dicoogleClient } = await import("dicoogle-client");

        const dicoogle = dicoogleClient("localhost:3000");

        // if required, login to the system before using
        const list = await dicoogle.users.list((err, res)=>{
            console.log('err: ', err);
            console.log('res: ', res);

        })
        const add = await dicoogle.users.add("Naresh", "Test@123", false, (err, res)=>{
            console.log('err: ', err);
            console.log('res: ', res);

        })
        console.log('add: ', add);
        // dicoogle.login("Naresh", "Test@123");

        // let {elapsedTime, results} = await dicoogle.search("PatientName:a", {provider: 'lucene'});
    } catch (error) {
        console.error("Error loading dicoogle-client:", error);
    }
})();
