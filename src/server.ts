import expressApp from "./expressApp"

const PORT = process.env.PORT || 8000;

export const StartServer = async () => {

    expressApp.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    process.on("uncaughtException", () => {
        console.error("An uncaught error occurred");
        process.exit(1);
    })
}

StartServer().then(() => {
    console.log("Server started successfully");
});