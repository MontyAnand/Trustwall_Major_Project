class SocketQueue {
    constructor() {
        this.queue = [];
    }

    // Enqueue an item
    enqueue(item) {
        this.queue.push(item);
        this.processQueue(); // Start processing if not already running
    }

    // Dequeue an item
    dequeue() {
        return this.queue.shift();
    }

    // Check if queue is empty
    isEmpty() {
        return this.queue.length === 0;
    }
}

module.exports.SocketQueue = new SocketQueue();


