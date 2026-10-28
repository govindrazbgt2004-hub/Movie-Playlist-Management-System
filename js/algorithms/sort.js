
"use strict";

// Compare two movies alphabetically by title.
function compareMovieTitles(movieA, movieB) {
    const titleA = String(movieA?.title ?? "").trim();
    const titleB = String(movieB?.title ?? "").trim();

    return titleA.localeCompare(titleB, undefined, {
        sensitivity: "base"
    });
}

window.SortAlgorithms = {

    // MERGE SORT
    mergeSort: function (movies) {
        if (!Array.isArray(movies)) {
            return [];
        }

        function merge(left, right) {
            const result = [];
            let i = 0;
            let j = 0;

            while (i < left.length && j < right.length) {
                if (compareMovieTitles(left[i], right[j]) <= 0) {
                    result.push(left[i]);
                    i++;
                } else {
                    result.push(right[j]);
                    j++;
                }
            }

            while (i < left.length) {
                result.push(left[i]);
                i++;
            }

            while (j < right.length) {
                result.push(right[j]);
                j++;
            }

            return result;
        }

        function divideAndSort(list) {
            if (list.length <= 1) {
                return list;
            }

            const middle = Math.floor(list.length / 2);

            const left = divideAndSort(list.slice(0, middle));
            const right = divideAndSort(list.slice(middle));

            return merge(left, right);
        }

        return divideAndSort(movies.slice());
    },

    // QUICK SORT
    quickSort: function (movies) {
        if (!Array.isArray(movies)) {
            return [];
        }

        // Work on a copy so the original array remains unchanged.
        const result = movies.slice();

        function partition(list, low, high) {
            const pivot = list[high];
            let smallerIndex = low;

            for (let j = low; j < high; j++) {
                if (compareMovieTitles(list[j], pivot) <= 0) {
                    const temp = list[smallerIndex];
                    list[smallerIndex] = list[j];
                    list[j] = temp;

                    smallerIndex++;
                }
            }

            const temp = list[smallerIndex];
            list[smallerIndex] = list[high];
            list[high] = temp;

            return smallerIndex;
        }

        function sort(list, low, high) {
            if (low < high) {
                const pivotIndex = partition(list, low, high);

                sort(list, low, pivotIndex - 1);
                sort(list, pivotIndex + 1, high);
            }
        }

        sort(result, 0, result.length - 1);

        return result;
    }
};

console.log("Sorting algorithms loaded successfully.");
