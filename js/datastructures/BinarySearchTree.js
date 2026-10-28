
"use strict";

// Each node stores a movie and two child references.
class TreeNode {
    constructor(movie) {
        this.movie = movie;
        this.key = movie.title.trim().toLowerCase();
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.size = 0;
    }

    // Insert a movie according to its title.
    insert(movie) {
        if (
            !movie ||
            typeof movie.title !== "string" ||
            movie.title.trim() === ""
        ) {
            return false;
        }

        const newNode = new TreeNode(movie);

        if (this.root === null) {
            this.root = newNode;
            this.size++;
            return true;
        }

        let current = this.root;

        while (true) {
            if (newNode.key === current.key) {
                // Update an existing movie with the same title.
                current.movie = movie;
                return false;
            }

            if (newNode.key < current.key) {
                if (current.left === null) {
                    current.left = newNode;
                    this.size++;
                    return true;
                }

                current = current.left;
            } else {
                if (current.right === null) {
                    current.right = newNode;
                    this.size++;
                    return true;
                }

                current = current.right;
            }
        }
    }

    // Search for a movie by title.
    search(title) {
        if (typeof title !== "string") {
            return null;
        }

        const key = title.trim().toLowerCase();
        let current = this.root;

        while (current !== null) {
            if (key === current.key) {
                return current.movie;
            }

            if (key < current.key) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        return null;
    }

    // Left -> Root -> Right
    inOrder() {
        const result = [];

        function traverse(node) {
            if (node === null) {
                return;
            }

            traverse(node.left);
            result.push(node.movie);
            traverse(node.right);
        }

        traverse(this.root);
        return result;
    }

    // Root -> Left -> Right
    preOrder() {
        const result = [];

        function traverse(node) {
            if (node === null) {
                return;
            }

            result.push(node.movie);
            traverse(node.left);
            traverse(node.right);
        }

        traverse(this.root);
        return result;
    }

    // Left -> Right -> Root
    postOrder() {
        const result = [];

        function traverse(node) {
            if (node === null) {
                return;
            }

            traverse(node.left);
            traverse(node.right);
            result.push(node.movie);
        }

        traverse(this.root);
        return result;
    }

    get length() {
        return this.size;
    }
}

// Make the class available to other JavaScript files.
window.BinarySearchTree = BinarySearchTree;
