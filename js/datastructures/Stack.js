
"use strict";

class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        if (this.isEmpty()) {
            return null;
        }

        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) {
            return null;
        }

        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    get size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }
}

// Make the Stack class available to main.js
window.Stack = Stack;
