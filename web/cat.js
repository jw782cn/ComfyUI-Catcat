import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

app.registerExtension({
    name: "chenran.showcat",
    setup() {
        let executing = false; // Tracks the current execution state

        // Create an image element for the cat GIF
        const catGif = document.createElement("img");

        // Initialize URLs for all GIFs
        const gifFilenames = [
            "images/cat_1.gif",
            "images/cat_2.gif",
            "images/cat_3.gif",
            "images/cat_4.gif",
            "images/cat_5.gif",
        ];
        // Map filenames to their full URL paths
        const gifUrls = gifFilenames.map(filename => new URL(filename, import.meta.url).toString());

        // Set basic styles for the cat GIF image
        catGif.style.position = "fixed";
        catGif.style.left = "5px";
        catGif.style.bottom = "5px";
        catGif.style.width = "500px"; // Adjust size as needed
        catGif.style.height = "auto";
        catGif.style.zIndex = "1000"; // Ensure the image is on top
        catGif.style.display = "none"; // Initially hidden
        document.body.appendChild(catGif); // Add the GIF to the document

        // Function to randomly select and display a cat GIF
        const showRandomGif = () => {
            const randomIndex = Math.floor(Math.random() * gifUrls.length);
            catGif.src = gifUrls[randomIndex]; // Set the source to a random GIF
            catGif.style.display = "block"; // Make the GIF visible
        };

        // Event listener functions
        const onExecutionStart = () => {
            if (!executing) { // Update only if the state changes from not executing to executing
                executing = true;
                showRandomGif(); // Display a random cat GIF
            }
        };

        const onExecutionEnd = () => {
            executing = false; // Update executing state
            catGif.style.display = "none"; // Hide the cat GIF
        };

        // Add event listeners to handle execution start and end
        api.addEventListener("execution_start", onExecutionStart);
        api.addEventListener("executing", ({ detail }) => {
            if (!detail && executing) { // If execution has ended and it was previously executing
                onExecutionEnd();
            }
        });
    },
});
