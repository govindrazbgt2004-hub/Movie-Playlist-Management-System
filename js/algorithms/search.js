
"use strict";

window.SearchAlgorithms = {

    // Linear Search: check every movie one by one.
    linearSearch: function (movies, query) {
        if (!Array.isArray(movies)) {
            return null;
        }

        const target = String(query ?? "").trim().toLowerCase();

        if (target === "") {
            return null;
        }

        for (let i = 0; i < movies.length; i++) {
            const title = String(movies[i]?.title ?? "")
                .trim()
                .toLowerCase();

            if (title === target) {
                return movies[i];
            }
        }

        return null;
    },

    // Binary Search: works on a list sorted by title.
    binarySearch: function (movies, query) {
        if (!Array.isArray(movies)) {
            return null;
        }

        const target = String(query ?? "").trim().toLowerCase();

        if (target === "") {
            return null;
        }

        let left = 0;
        let right = movies.length - 1;

        while (left <= right) {
            const middle = Math.floor((left + right) / 2);

            const title = String(movies[middle]?.title ?? "")
                .trim()
                .toLowerCase();

            if (title === target) {
                return movies[middle];
            }

            if (title < target) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }

        return null;
    }
};

console.log("Search algorithms loaded successfully.");
