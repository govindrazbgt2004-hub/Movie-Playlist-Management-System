"use strict";

class Queue {
    constructor() {
        this.items = [];
        this.frontIndex = 0;
    }

    // Add a movie to the back of the queue
    enqueue(item) {
        this.items.push(item);
    }

    // Remove and return the first movie
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }

        const item = this.items[this.frontIndex];
        this.frontIndex++;

        // Reset the queue when it becomes empty
        if (this.frontIndex === this.items.length) {
            this.items = [];
            this.frontIndex = 0;
        } else if (
            this.frontIndex > 50 &&
            this.frontIndex * 2 >= this.items.length
        ) {
            // Reclaim space used by already removed items
            this.items = this.items.slice(this.frontIndex);
            this.frontIndex = 0;
        }

        return item;
    }

    // View the next movie without removing it
    peek() {
        if (this.isEmpty()) {
            return null;
        }

        return this.items[this.frontIndex];
    }

    isEmpty() {
        return this.frontIndex >= this.items.length;
    }

    get size() {
        return this.items.length - this.frontIndex;
    }

    // Return only the movies still in the queue
    toArray() {
        return this.items.slice(this.frontIndex);
    }

    clear() {
        this.items = [];
        this.frontIndex = 0;
    }
}

window.Queue = Queue;