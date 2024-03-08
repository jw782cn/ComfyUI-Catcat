import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

app.registerExtension({
  name: "chenran.showcat",
  setup() {
    // Tracks the current execution state
    let executing = false;

    // Create an image element for the cat GIF
    const catGif = document.createElement("img");
    document.body.appendChild(catGif);

    // Create a resize button
    const resizeBtn = document.createElement("img");
    document.body.appendChild(resizeBtn); // Append the button to the body

    // Initialize URLs for all GIFs
    const gifFilenames = [
      "images/cat_1.gif",
      "images/cat_2.gif",
      "images/cat_3.gif",
      "images/cat_4.gif",
      "images/cat_5.gif",
    ];
    const gifUrls = gifFilenames.map((filename) =>
      new URL(filename, import.meta.url).toString()
    );

    // Set basic styles for the cat GIF image
    catGif.style.position = "fixed";
    catGif.style.left = "5px";
    catGif.style.bottom = "5px";
    catGif.style.width = "500px"; // Adjust size as needed
    catGif.style.height = "auto";
    catGif.style.zIndex = "1000";
    catGif.style.display = "none"; // Initially hidden

    // Added an icon for resizing
    resizeBtn.src = new URL("images/resize_icon.png", import.meta.url); // Set the background image
    resizeBtn.style.width = "20px";
    resizeBtn.style.height = "20px";
    resizeBtn.style.backgroundColor = "white";
    resizeBtn.style.position = "absolute";
    resizeBtn.style.right = "5px";
    resizeBtn.style.bottom = "30px";
    resizeBtn.style.display = "none"; // Initially hidden
    resizeBtn.style.zIndex = "1001"; // Ensure higher than catGif

    // Function to randomly select and display a cat GIF
    const showRandomGif = () => {
      const randomIndex = Math.floor(Math.random() * gifUrls.length);
      catGif.src = gifUrls[randomIndex]; // Set the source to a random GIF
      catGif.style.display = "block"; // Make the GIF visible
    };

    // Drag and drop functionality
    let offsetX = 0;
    let offsetY = 0;
    let drag = false;

    // Resize functionality
    let resizing = false;
    let startX, startY, startWidth, startHeight;

    resizeBtn.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent any default action
        resizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(catGif).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(catGif).height, 10);
        document.addEventListener('mousemove', onResizeMouseMove);
        document.addEventListener('mouseup', onResizeMouseUp);
    });

    const onResizeMouseMove = (e) => {
        if (resizing) {
            let width = startWidth + e.clientX - startX;
            catGif.style.width = `${width}px`;
            catGif.style.height = "auto"; // Adjust height automatically
            updateResizeBtnPosition();
        }
    };

    const onResizeMouseUp = () => {
        resizing = false;
        document.removeEventListener('mousemove', onResizeMouseMove);
        document.removeEventListener('mouseup', onResizeMouseUp);
    };

    const updateResizeBtnPosition = () => {
        let rect = catGif.getBoundingClientRect();
        resizeBtn.style.right = `${window.innerWidth - rect.right}px`;
        resizeBtn.style.top = `${rect.top}px`;
    }

    // Prevent image drag (to avoid being dropped into other components)
    catGif.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });

    catGif.addEventListener("mouseenter", () => {
        resizeBtn.style.display = "block";
        updateResizeBtnPosition();
    });

    catGif.addEventListener("mouseleave", () => {
        if (!resizing) {
            resizeBtn.style.display = "none";
        }
    });

    // Drag and drop functionality with cursor style change
    catGif.addEventListener("mousedown", (e) => {
      drag = true;
      catGif.style.cursor = "grabbing"; // Change cursor to grabbing on mousedown
      offsetX = e.clientX - catGif.getBoundingClientRect().left;
      offsetY = e.clientY - catGif.getBoundingClientRect().top;
      updateResizeBtnPosition();

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    const onMouseMove = (e) => {
      if (drag) {
        catGif.style.left = `${e.clientX - offsetX}px`;
        catGif.style.top = `${e.clientY - offsetY}px`;
        updateResizeBtnPosition();
      }
    };

    const onMouseUp = () => {
      drag = false;
      catGif.style.cursor = "default"; // Revert cursor to default on mouseup
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    // Event listener functions
    const onExecutionStart = () => {
      if (!executing) {
        executing = true;
        showRandomGif();
      }
    };

    const onExecutionEnd = () => {
      executing = false;
      catGif.style.display = "none";
    };

    // Add event listeners
    api.addEventListener("execution_start", onExecutionStart);
    api.addEventListener("executing", ({ detail }) => {
      if (!detail && executing) {
        onExecutionEnd();
      }
    });
  },
});
