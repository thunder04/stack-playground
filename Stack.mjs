export class Stack {
    items = []

    peek() { return this.isEmpty() ? null : this.items[ this.items.length - 1 ] }
    pop() { return this.isEmpty() ? null : this.items.pop() }
    push(item) { return this.items.push(item), item }
    flush() { return this.items.length = 0, this }
    isEmpty() { return this.items.length === 0 }
}

export default Stack