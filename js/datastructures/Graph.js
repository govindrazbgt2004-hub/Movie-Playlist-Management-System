
"use strict";

class MovieGraph {
    constructor() {
        // Each movie maps to a set of connected movies.
        this.adjacencyList = new Map();
    }

    addVertex(movie) {
        if (!this.adjacencyList.has(movie)) {
            this.adjacencyList.set(movie, new Set());
        }
    }

    // Create an undirected connection between two movies.
    addEdge(movie1, movie2) {
        this.addVertex(movie1);
        this.addVertex(movie2);

        this.adjacencyList.get(movie1).add(movie2);
        this.adjacencyList.get(movie2).add(movie1);
    }

    // Breadth-First Search
    bfs(start) {
        if (!this.adjacencyList.has(start)) {
            return [];
        }

        const visited = new Set([start]);
        const queue = [start];
        const result = [];
        let front = 0;

        while (front < queue.length) {
            const current = queue[front++];
            result.push(current);

            for (const neighbor of this.adjacencyList.get(current)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }

        return result;
    }

    // Depth-First Search
    dfs(start) {
        if (!this.adjacencyList.has(start)) {
            return [];
        }

        const visited = new Set();
        const result = [];

        function traverse(current, graph) {
            visited.add(current);
            result.push(current);

            for (const neighbor of graph.adjacencyList.get(current)) {
                if (!visited.has(neighbor)) {
                    traverse(neighbor, graph);
                }
            }
        }

        traverse(start, this);
        return result;
    }

    getVertices() {
        return Array.from(this.adjacencyList.keys());
    }
}

window.MovieGraph = MovieGraph;
