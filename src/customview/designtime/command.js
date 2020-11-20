
class Command {
    constructor(name,editor) {
        this.name = name;
        this.editor = editor
    }
    execute() { }
    undo() { }
    redo() {
        this.execute();
    }
}

// 增加新的节点
class AddNodes extends Command {
    constructor(nodes, editor) {
        super('addShape',editor);
        this.nodes = nodes;
    }
    execute() {
        this.nodes.forEach(item => {
            this.editor.addNode(item);
        });
    }
    undo() {
        this.nodes.forEach(item => {
            this.editor.removeNode(item);
        });
    }
}


export {
    AddNodes
}