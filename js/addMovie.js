
"use strict";

const addMovieForm = document.querySelector("#add-movie-form");
const addMovieStatus = document.querySelector("#add-movie-status");

// Keep user-added movies saved in the browser.
let customMovies = [];

try {
    const savedMovies = localStorage.getItem("cineQueueCustomMovies");

    if (savedMovies) {
        const parsedMovies = JSON.parse(savedMovies);

        if (Array.isArray(parsedMovies)) {
            customMovies = parsedMovies;
        }
    }
} catch (error) {
    console.error("Could not load custom movies:", error);
}

// Check whether a movie title already exists.
function movieTitleExists(title) {
    const target = title.trim().toLowerCase();

    return movieCards.some(function (card) {
        return getMovieData(card).title.trim().toLowerCase() === target;
    });
}

// Build a movie card safely using DOM methods.
function createCustomMovieCard(movie) {
    const card = document.createElement("article");
    card.className = "movie-card";

    const posterBox = document.createElement("div");
    posterBox.className = "poster";

    const image = document.createElement("img");
    image.src = movie.posterUrl;
    image.alt = movie.title + " movie poster";
    image.loading = "lazy";

    image.addEventListener("error", function () {
        posterBox.replaceChildren();
        posterBox.textContent = "🎬";
        posterBox.style.fontSize = "48px";
        posterBox.setAttribute("aria-label", "Poster unavailable");
    }, { once: true });

    posterBox.appendChild(image);

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const genreYear = document.createElement("p");
    genreYear.textContent = movie.genreYear;

    const duration = document.createElement("p");
    duration.textContent = "Duration: " + movie.duration + " minutes";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add to Playlist";

    const queueButton = document.createElement("button");
    queueButton.type = "button";
    queueButton.className = "queue-button";
    queueButton.textContent = "Add to Queue";

    card.append(
        posterBox,
        title,
        genreYear,
        duration,
        addButton,
        queueButton
    );

    // Add the movie to the custom Linked List playlist.
    addButton.addEventListener("click", function () {
        const movieData = getMovieData(card);

        const existing = playlist.find(function (item) {
            return item.title.toLowerCase() ===
                movieData.title.toLowerCase();
        });

        if (existing !== null) {
            alert(movieData.title + " is already in your playlist!");
            return;
        }

        playlist.append(movieData);
        undoStack.push(movieData.title);
        renderPlaylist();
    });

    // Add the movie to the upcoming FIFO Queue.
    queueButton.addEventListener("click", function () {
        const movieData = getMovieData(card);

        const alreadyQueued = upcomingQueue.toArray().some(function (item) {
            return item.title.toLowerCase() ===
                movieData.title.toLowerCase();
        });

        if (alreadyQueued) {
            alert(movieData.title + " is already in the queue!");
            return;
        }

        upcomingQueue.enqueue(movieData);
        renderQueue();
    });

    return card;
}

// Add one movie to the catalogue and update related Data Structures.
function addCustomMovie(movie, shouldSave) {
    if (movieTitleExists(movie.title)) {
        return false;
    }

    const card = createCustomMovieCard(movie);

    movieListContainer.appendChild(card);

    // Update the catalogue used by search and other features.
    movieCards.push(card);

    // Include the movie in the original order used by Reset Sorting.
    originalMovieOrder.push({
        title: movie.title,
        card: card
    });

    // Update the BST and Graph.
    const movieData = {
        title: movie.title,
        genreYear: movie.genreYear,
        duration: movie.duration
    };

    movieTree.insert(movieData);
    movieGraph.addVertex(movie.title);

    // Allow this movie to be selected as a Graph starting node.
    const graphStart = document.querySelector("#graph-start");

    if (graphStart) {
        const optionExists = Array.from(graphStart.options).some(
            option => option.value.toLowerCase() ===
                movie.title.toLowerCase()
        );

        if (!optionExists) {
            const option = document.createElement("option");
            option.value = movie.title;
            option.textContent = movie.title;
            graphStart.appendChild(option);
        }
    }

    if (shouldSave) {
        customMovies.push(movie);

        try {
            localStorage.setItem(
                "cineQueueCustomMovies",
                JSON.stringify(customMovies)
            );

            addMovieStatus.textContent =
                movie.title + " added successfully and saved!";
        } catch (error) {
            console.error("Could not save custom movies:", error);

            addMovieStatus.textContent =
                movie.title +
                " was added for this session, but browser storage failed.";
        }
    }

    return true;
}

// Restore user-added movies when the page opens.
customMovies.forEach(function (movie) {
    addCustomMovie(movie, false);
});

// Process the Add New Movie form.
addMovieForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.querySelector("#new-movie-title")
        .value.trim();

    const genre = document.querySelector("#new-movie-genre")
        .value.trim();

    const year = Number(
        document.querySelector("#new-movie-year").value
    );

    const duration = Number(
        document.querySelector("#new-movie-duration").value
    );

    const posterUrl = document.querySelector("#new-movie-poster")
        .value.trim();

    if (!title || !genre || !posterUrl) {
        addMovieStatus.textContent =
            "Please complete all fields.";
        return;
    }

    if (
        !Number.isInteger(year) ||
        year < 1888 ||
        year > 2100 ||
        !Number.isInteger(duration) ||
        duration < 1 ||
        duration > 600
    ) {
        addMovieStatus.textContent =
            "Enter a valid release year and duration.";
        return;
    }

    const movie = {
        title: title,
        genreYear: genre + " · " + year,
        duration: duration,
        posterUrl: posterUrl
    };

    if (!addCustomMovie(movie, true)) {
        addMovieStatus.textContent =
            "A movie with this title already exists.";
        return;
    }

    addMovieForm.reset();
});
