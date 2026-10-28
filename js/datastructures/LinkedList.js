"use strict";

// One node stores data and a link to the next node.
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

prepend(data) {
    const newNode = new Node(data);

    if (this.head === null) {
        this.head = newNode;
        this.tail = newNode;
    } else {
        newNode.next = this.head;
        this.head = newNode;
    }

    this.size++;
}

    // Add a new node at the end of the list.
    append(data) {
        const newNode = new Node(data);

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }

        this.size++;
    }

    // Find a node that matches a condition.
    find(predicate) {
        let current = this.head;

        while (current !== null) {
            if (predicate(current.data)) {
                return current.data;
            }

            current = current.next;
        }

        return null;
    }

    // Remove a node using its zero-based index.
    removeAt(index) {
        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= this.size
        ) {
            return false;
        }

        if (index === 0) {
            this.head = this.head.next;

            if (this.head === null) {
                this.tail = null;
            }

            this.size--;
            return true;
        }

        let previous = this.head;

        for (let i = 0; i < index - 1; i++) {
            previous = previous.next;
        }

        const nodeToRemove = previous.next;

        previous.next = nodeToRemove.next;

        if (nodeToRemove === this.tail) {
            this.tail = previous;
        }

        this.size--;
        return true;
    }

    // Convert the linked nodes to an array for display and saving.
    toArray() {
        const items = [];
        let current = this.head;

        while (current !== null) {
            items.push(current.data);
            current = current.next;
        }

        return items;
    }

    get length() {
        return this.size;
    }
}

// Make the class available to main.js.
window.LinkedList = LinkedList;
