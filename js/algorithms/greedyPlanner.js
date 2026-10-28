
"use strict";

window.GreedyPlanner = {
    plan: function (movies, availableMinutes) {
        const budget = Number(availableMinutes);

        // Validate the input.
        if (
            !Array.isArray(movies) ||
            !Number.isFinite(budget) ||
            budget < 0
        ) {
            return null;
        }

        // Keep only movies with valid positive durations.
        const candidates = movies
            .filter(function (movie) {
                return movie &&
                    typeof movie.title === "string" &&
                    Number.isFinite(Number(movie.duration)) &&
                    Number(movie.duration) > 0;
            })
            .map(function (movie) {
                return {
                    ...movie,
                    duration: Number(movie.duration)
                };
            });

        const selected = [];
        const skipped = [];
        let totalDuration = 0;

        // Repeatedly choose the shortest remaining movie.
        while (candidates.length > 0) {
            let shortestIndex = 0;

            for (let i = 1; i < candidates.length; i++) {
                const current = candidates[i];
                const shortest = candidates[shortestIndex];

                if (
                    current.duration < shortest.duration ||
                    (
                        current.duration === shortest.duration &&
                        current.title.localeCompare(
                            shortest.title,
                            undefined,
                            { sensitivity: "base" }
                        ) < 0
                    )
                ) {
                    shortestIndex = i;
                }
            }

            const shortestMovie = candidates.splice(
                shortestIndex,
                1
            )[0];

            if (
                totalDuration + shortestMovie.duration <= budget
            ) {
                selected.push(shortestMovie);
                totalDuration += shortestMovie.duration;
            } else {
                // All remaining movies are at least as long.
                skipped.push(shortestMovie, ...candidates);
                break;
            }
        }

        return {
            selected: selected,
            skipped: skipped,
            totalDuration: totalDuration,
            remainingMinutes: budget - totalDuration,
            availableMinutes: budget
        };
    }
};

console.log("Greedy Movie Planner loaded successfully.");
