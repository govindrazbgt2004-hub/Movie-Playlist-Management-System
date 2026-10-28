
"use strict";

// 1. Select HTML elements
let movieCards = Array.from(
    document.querySelectorAll(".movie-card")
);
const searchInput = document.querySelector("#movie-search");

const playlistItems = document.querySelector("#playlist-items");
const playlistSummary = document.querySelector("#playlist-summary");
const undoButton = document.querySelector("#undo-button");

const queueItems = document.querySelector("#queue-items");
const queueSummary = document.querySelector("#queue-summary");
const playNextButton = document.querySelector("#play-next-button");

// 2. Create our Data Structures
const playlist = new window.LinkedList();
const undoStack = new window.Stack();
const upcomingQueue = new window.Queue();
const movieTree = new window.BinarySearchTree();

// 3. Load saved data from Local Storage
function loadSavedArray(key) {
    try {
        const saved = localStorage.getItem(key);

        if (saved === null) {
            return [];
        }

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Could not load saved data:", error);
        return [];
    }
}

// Restore the playlist
loadSavedArray("cineQueuePlaylist").forEach(function (movie) {
    playlist.append(movie);
});

// Restore the upcoming queue
loadSavedArray("cineQueueUpcomingMovies").forEach(function (movie) {
    upcomingQueue.enqueue(movie);
});

// 4. Save the playlist
function savePlaylist() {
    try {
        localStorage.setItem(
            "cineQueuePlaylist",
            JSON.stringify(playlist.toArray())
        );
    } catch (error) {
        console.error("Could not save playlist:", error);
    }
}

// Save the Queue
function saveQueue() {
    try {
        localStorage.setItem(
            "cineQueueUpcomingMovies",
            JSON.stringify(upcomingQueue.toArray())
        );
    } catch (error) {
        console.error("Could not save queue:", error);
    }
}

// 5. Get movie data from a movie card
function getMovieData(card) {
    const title = card.querySelector("h3").textContent;
    const paragraphs = card.querySelectorAll("p");

    const genreYear = paragraphs[0].textContent;
    const durationText = paragraphs[1].textContent;

    const durationMatch = durationText.match(/\d+/);
    const duration = durationMatch
        ? Number(durationMatch[0])
        : 0;

    return {
        title: title,
        genreYear: genreYear,
        duration: duration
    };
}
// Build the BST from the movie catalogue.
movieCards.forEach(function (card) {
    movieTree.insert(getMovieData(card));
});

// 6. Display the playlist
function renderPlaylist() {
    const movies = playlist.toArray();

    if (movies.length === 0) {
        playlistItems.innerHTML =
            "<p>Your playlist is empty. Add your favourite movies to get started!</p>";
    } else {
        playlistItems.innerHTML = movies.map(function (movie, index) {
            return `
                <div class="playlist-item">
                    <p>
                        <strong>${movie.title}</strong>
                        — ${movie.genreYear}
                        — ${movie.duration} minutes
                    </p>

                    <button type="button" data-remove-index="${index}">
                        Remove
                    </button>
                </div>
            `;
        }).join("");
    }

    const totalDuration = movies.reduce(function (total, movie) {
        return total + movie.duration;
    }, 0);

    playlistSummary.textContent =
        "Total movies: " + playlist.length +
        " | Total duration: " + totalDuration + " minutes";

    undoButton.disabled = undoStack.isEmpty();

    savePlaylist();
}

// 7. Display the upcoming Queue
function renderQueue() {
    const movies = upcomingQueue.toArray();

    if (movies.length === 0) {
        queueItems.innerHTML =
            "<p>Queue is empty. Add a movie to get started!</p>";
    } else {
        queueItems.innerHTML = movies.map(function (movie, index) {
            return `
                <div class="playlist-item">
                    <p>
                        <strong>${movie.title}</strong>
                        — ${movie.genreYear}
                        — ${movie.duration} minutes
                    </p>

                    <span>Position ${index + 1}</span>
                </div>
            `;
        }).join("");
    }

    const totalDuration = movies.reduce(function (total, movie) {
        return total + movie.duration;
    }, 0);

    queueSummary.textContent =
        "Queued movies: " + upcomingQueue.size +
        " | Total duration: " + totalDuration + " minutes";

    playNextButton.disabled = upcomingQueue.isEmpty();

    saveQueue();
}

// 8. Add Playlist and Queue buttons to every movie card
movieCards.forEach(function (card) {
    const addButton = card.querySelector("button");

    // Add a second button for the upcoming queue
    const queueButton = document.createElement("button");

    queueButton.type = "button";
    queueButton.className = "queue-button";
    queueButton.textContent = "Add to Queue";

    addButton.insertAdjacentElement("afterend", queueButton);

    // Add movie to the Linked List playlist
    addButton.addEventListener("click", function () {
        const movie = getMovieData(card);

        const existingMovie = playlist.find(function (item) {
            return item.title === movie.title;
        });

        if (existingMovie !== null) {
            alert(movie.title + " is already in your playlist!");
            return;
        }

        playlist.append(movie);
        undoStack.push(movie.title);

        renderPlaylist();
    });

    // Add movie to the FIFO Queue
    queueButton.addEventListener("click", function () {
        const movie = getMovieData(card);

        const alreadyQueued = upcomingQueue
            .toArray()
            .some(function (item) {
                return item.title === movie.title;
            });

        if (alreadyQueued) {
            alert(movie.title + " is already in the queue!");
            return;
        }

        upcomingQueue.enqueue(movie);
        renderQueue();
    });
});

// 9. Undo the last playlist addition using Stack
undoButton.addEventListener("click", function () {
    const lastAddedTitle = undoStack.pop();

    if (lastAddedTitle === null) {
        return;
    }

    const index = playlist.toArray().findIndex(function (movie) {
        return movie.title === lastAddedTitle;
    });

    if (index !== -1) {
        playlist.removeAt(index);
    }

    renderPlaylist();
});

// 10. Play Next: remove the first movie from the Queue
playNextButton.addEventListener("click", function () {
    const nextMovie = upcomingQueue.dequeue();

    if (nextMovie === null) {
        return;
    }

    alert("Now playing (demo): " + nextMovie.title);

    renderQueue();
});

// 11. Remove a movie manually from the playlist
playlistItems.addEventListener("click", function (event) {
    if (event.target.matches("button[data-remove-index]")) {
        const index = Number(event.target.dataset.removeIndex);

        if (playlist.removeAt(index)) {
            undoStack.clear();
            renderPlaylist();
        }
    }
});

// 12. Search movies by title
searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase().trim();

    movieCards.forEach(function (card) {
        const title = card.querySelector("h3").textContent.toLowerCase();

        card.hidden = !title.includes(searchTerm);
    });
});

"use strict";

// Select the Movie Tree interface elements.
const treeInorderButton = document.querySelector("#tree-inorder");
const treePreorderButton = document.querySelector("#tree-preorder");
const treePostorderButton = document.querySelector("#tree-postorder");

const treeResults = document.querySelector("#tree-results");
const treeSearchInput = document.querySelector("#tree-search-input");
const treeSearchButton = document.querySelector("#tree-search-button");
const treeSearchResult = document.querySelector("#tree-search-result");

// Display traversal results safely.
function displayTreeResults(movies) {
    treeResults.replaceChildren();

    if (movies.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No movies found.";
        treeResults.appendChild(item);
        return;
    }

    movies.forEach(function (movie) {
        const item = document.createElement("li");

        item.textContent =
            movie.title + " — " +
            movie.genreYear + " — " +
            movie.duration + " minutes";

        treeResults.appendChild(item);
    });
}

// Inorder: alphabetical order for this BST.
treeInorderButton.addEventListener("click", function () {
    displayTreeResults(movieTree.inOrder());
});

// Preorder: Root, Left, Right.
treePreorderButton.addEventListener("click", function () {
    displayTreeResults(movieTree.preOrder());
});

// Postorder: Left, Right, Root.
treePostorderButton.addEventListener("click", function () {
    displayTreeResults(movieTree.postOrder());
});

// Search for a movie title in the BST.
treeSearchButton.addEventListener("click", function () {
    const title = treeSearchInput.value.trim();

    if (title === "") {
        treeSearchResult.textContent =
            "Please enter a movie title.";
        return;
    }

    const movie = movieTree.search(title);

    if (movie !== null) {
        treeSearchResult.textContent =
            "Found: " + movie.title +
            " — " + movie.genreYear +
            " — " + movie.duration + " minutes";
    } else {
        treeSearchResult.textContent =
            "Movie not found: " + title;
    }
});

// Show alphabetical results when the page opens.
displayTreeResults(movieTree.inOrder());


// 13. Display saved data on page load
renderPlaylist();
renderQueue();

"use strict";

// Create the Movie Graph.
const movieGraph = new window.MovieGraph();

// Add all movies from the catalogue as graph vertices.
movieCards.forEach(function (card) {
    const title = card.querySelector("h3").textContent.trim();
    movieGraph.addVertex(title);
});

// Add one demo node to help demonstrate traversal.
movieGraph.addVertex("The Martian");

// Connect the movies.
movieGraph.addEdge("Interstellar", "Inception");
movieGraph.addEdge("Interstellar", "3 Idiots");
movieGraph.addEdge("Inception", "The Martian");

// Select Graph Explorer elements.
const graphStartSelect = document.querySelector("#graph-start");
const graphResults = document.querySelector("#graph-results");
const runBfsButton = document.querySelector("#run-bfs");
const runDfsButton = document.querySelector("#run-dfs");
const graphInfo = document.querySelector("#graph-info");

// Display traversal results on the webpage.
function displayGraphResults(order, method) {
    graphResults.replaceChildren();

    if (order.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No connected movies found.";
        graphResults.appendChild(item);
    } else {
        order.forEach(function (title, index) {
            const item = document.createElement("li");

            item.textContent =
                (index + 1) + ". " + title +
                (title === "The Martian" ? " (Demo Node)" : "");

            graphResults.appendChild(item);
        });
    }

    graphInfo.textContent =
        method + " visited " + order.length + " connected movie nodes.";
}

// Run Breadth-First Search.
runBfsButton.addEventListener("click", function () {
    const start = graphStartSelect.value;
    const result = movieGraph.bfs(start);

    displayGraphResults(result, "BFS");
});

// Run Depth-First Search.
runDfsButton.addEventListener("click", function () {
    const start = graphStartSelect.value;
    const result = movieGraph.dfs(start);

    displayGraphResults(result, "DFS");
});

"use strict";

// Get the sorting controls and movie container.
const movieListContainer = document.querySelector(".movie-list");
const mergeSortButton = document.querySelector("#sort-merge");
const quickSortButton = document.querySelector("#sort-quick");
const resetSortButton = document.querySelector("#sort-reset");
const sortStatus = document.querySelector("#sort-status");

// Remember the original movie card order.
const originalMovieOrder = Array.from(movieCards).map(function (card) {
    return {
        title: card.querySelector("h3").textContent.trim(),
        card: card
    };
});

// Display movie cards in the order returned by an algorithm.
function applyMovieSort(algorithmName, displayName) {
    const sortedMovies =
        window.SortAlgorithms[algorithmName](originalMovieOrder);

    sortedMovies.forEach(function (movie) {
        movieListContainer.appendChild(movie.card);
    });

    sortStatus.textContent =
        displayName + " completed. Order: " +
        sortedMovies.map(function (movie) {
            return movie.title;
        }).join(" → ");
}

// Merge Sort button.
mergeSortButton.addEventListener("click", function () {
    applyMovieSort("mergeSort", "Merge Sort");
});

// Quick Sort button.
quickSortButton.addEventListener("click", function () {
    applyMovieSort("quickSort", "Quick Sort");
});

// Restore the original card order.
resetSortButton.addEventListener("click", function () {
    originalMovieOrder.forEach(function (movie) {
        movieListContainer.appendChild(movie.card);
    });

    sortStatus.textContent =
        "Original order restored: " +
        originalMovieOrder.map(function (movie) {
            return movie.title;
        }).join(" → ");
});

"use strict";

// Select the Movie Marathon Planner elements.
const availableMinutesInput =
    document.querySelector("#available-minutes");

const planMarathonButton =
    document.querySelector("#plan-marathon");

const marathonSummary =
    document.querySelector("#marathon-summary");

const marathonSelected =
    document.querySelector("#marathon-selected");

const marathonSkipped =
    document.querySelector("#marathon-skipped");

// Display movie titles and durations safely.
function displayMarathonMovies(container, movies) {
    container.replaceChildren();

    if (movies.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No movies in this list.";
        container.appendChild(item);
        return;
    }

    movies.forEach(function (movie) {
        const item = document.createElement("li");

        item.textContent =
            movie.title + " — " + movie.duration + " minutes";

        container.appendChild(item);
    });
}

// Generate a plan using our custom Greedy Algorithm.
planMarathonButton.addEventListener("click", function () {
    const availableMinutes = Number(
        availableMinutesInput.value
    );

    if (
        availableMinutesInput.value.trim() === "" ||
        !Number.isFinite(availableMinutes) ||
        availableMinutes <= 0
    ) {
        marathonSummary.textContent =
            "Please enter a valid watch-time greater than zero.";

        return;
    }

    // Read the existing movie catalogue.
    const catalogue = Array.from(movieCards).map(function (card) {
        return getMovieData(card);
    });

    const plan = window.GreedyPlanner.plan(
        catalogue,
        availableMinutes
    );

    if (plan === null) {
        marathonSummary.textContent =
            "Could not generate the movie plan.";

        return;
    }

    displayMarathonMovies(
        marathonSelected,
        plan.selected
    );

    displayMarathonMovies(
        marathonSkipped,
        plan.skipped
    );

    marathonSummary.textContent =
        "Selected " + plan.selected.length +
        " movies | Total duration: " +
        plan.totalDuration + " minutes | Remaining: " +
        plan.remainingMinutes + " minutes";
});

// Search Algorithms Explorer

const algorithmSearchInput =
    document.querySelector("#algorithm-search-input");

const linearSearchButton =
    document.querySelector("#linear-search-button");

const binarySearchButton =
    document.querySelector("#binary-search-button");

const algorithmSearchResult =
    document.querySelector("#algorithm-search-result");

// Read movie information from the current catalogue.
function getSearchCatalogue() {
    return Array.from(movieCards).map(function (card) {
        return getMovieData(card);
    });
}

// Display a search result.
function displayAlgorithmSearchResult(movie, algorithmName) {
    if (movie === null) {
        algorithmSearchResult.textContent =
            algorithmName + ": Movie not found.";
        return;
    }

    algorithmSearchResult.textContent =
        algorithmName + ": Found " + movie.title +
        " | " + movie.genreYear +
        " | Duration: " + movie.duration + " minutes";
}

// Run Linear Search.
linearSearchButton.addEventListener("click", function () {
    const query = algorithmSearchInput.value.trim();

    if (query === "") {
        algorithmSearchResult.textContent =
            "Please enter a movie title.";
        return;
    }

    const catalogue = getSearchCatalogue();

    const result = window.SearchAlgorithms.linearSearch(
        catalogue,
        query
    );

    displayAlgorithmSearchResult(result, "Linear Search");
});

// Run Binary Search on a sorted copy of the catalogue.
binarySearchButton.addEventListener("click", function () {
    const query = algorithmSearchInput.value.trim();

    if (query === "") {
        algorithmSearchResult.textContent =
            "Please enter a movie title.";
        return;
    }

    const catalogue = getSearchCatalogue();

    // Binary Search requires the list to be sorted first.
    const sortedCatalogue = window.SortAlgorithms.mergeSort(
        catalogue
    );

    const result = window.SearchAlgorithms.binarySearch(
        sortedCatalogue,
        query
    );

    displayAlgorithmSearchResult(result, "Binary Search");
});
