import directives from './directives.js'

class Directive {

    constructor(name, node) {
        if (directives[name]) {
            this.fn = directives[name];
            this.nodes = [node];
        }
    }

    update(mvvm, newVal) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.fn.call(mvvm, this.nodes[i], newVal);
        }
    }
}

export default Directive;