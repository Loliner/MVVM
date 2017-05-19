import directives from './directives.js'

class Directive {

    constructor(name, type, node) {
        const direct = directives[name];
        if (Object.prototype.toString.call(direct) === '[object Function]') {
            this.fn = direct;
            this.type = type;
            this.nodes = [node];
        } else if (Object.prototype.toString.call(direct) === '[object Object]') {
            this.fn = direct.update;
            this.type = type;
            this.nodes = [node];
        }
    }

    update(mvvm, newVal) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.fn(this.nodes[i], newVal);
        }
    }
}

export default Directive;