// Store your Unsplash API access key in a variable
const accessKey = "zzJ2vc8IFOrMpZd-uXj16hqaBukurgWbay5QAhobqZk";

// Add an event listener to the download buttons
document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('download-button')) {
        event.preventDefault();

        const imageURL = target.getAttribute('data-image-url');
        const fileName = target.getAttribute('data-download-filename');

        const a = document.createElement('a');
        a.href = imageURL;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

// Select specific elements on your web page using JavaScript
const formElement = document.querySelector("form"); // Find a form
const inputElement = document.getElementById("search-input"); // Find an input box
const searchResults = document.querySelector(".search-results"); // Find where to display search results
const showMore = document.getElementById("show-more-button"); // Find the "Show More" button

// Initialize variables to store data and keep track of the current page
let inputData = ""; // To store what the user typed
let page = 1; // To keep track of the current page of results

// Asynchronous function to search and display images
async function searchImages() {
    // Get the user's search query from the input box
    inputData = inputElement.value;

    // Create a URL to request images from Unsplash using the user's query, current page, and access key
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    // Send a request to Unsplash and wait for a response
    const response = await fetch(url);
    const data = await response.json();

    // Extract the image results from the response
    const results = data.results;

    // If it's the first page, clear the previous search results
    if (page === 1) {
        searchResults.innerHTML = "";
    }

    // Loop through the image results and display them
    results.map((result) => {
        const imageWrapper = document.createElement('div'); // Create a container for each image
        imageWrapper.classList.add('search-result'); // Apply a CSS style to the container

        const image = document.createElement('img'); // Create an image element
        image.src = result.urls.small; // Set the image source
        image.alt = result.alt_description; // Set the image description

        const imageLink = document.createElement('a'); // Create a link for each image
        imageLink.href = result.links.html; // Set the link to the image source on Unsplash
        imageLink.target = "_blank"; // Open the link in a new tab
        imageLink.textContent = result.alt_description; // Show the image description as text

        // Create a download button for each image
        const downloadButton = document.createElement('a');
        downloadButton.href = result.urls.full; // Use the full-size image URL for download
        downloadButton.download = `${result.id}.jpg`; // Set the download file name
        downloadButton.textContent = "Download";
        downloadButton.classList.add('download-button');
        downloadButton.setAttribute('data-image-url', result.urls.full);
        downloadButton.setAttribute('data-download-filename', `${result.id}.jpg`);

        // Append the image, link, and download button to the image container
        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
        imageWrapper.appendChild(downloadButton);

        // Add the image container to the search results
        searchResults.appendChild(imageWrapper);
    });

    // Increment the page number
    page++;

    // If there are more than one page of results, display the "Show More" button
    if (page > 1) {
        showMore.style.display = "block";
    }
}

// Add an event listener for form submission
formElement.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission
    page = 1; // Reset the page number to 1
    searchImages(); // Call the searchImages function to perform a new search
});

// Add an event listener for the "Show More" button click
showMore.addEventListener("click", () => {
    searchImages(); // Call the searchImages function to load more images
});
