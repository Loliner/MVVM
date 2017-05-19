import directives from './directives.js'

class Directive {

    constructor(name, type, node) {
        const direct = directives[name];
        if (Object.prototype.toString.call(direct) === '[object Function]') {
            this._update = direct;
            this.type = type;
            this.nodes = [node];
        } else if (Object.prototype.toString.call(direct) === '[object Object]') {
            this._update = direct.update;
            this._bind = direct.bind;
            this.type = type;
            this.nodes = [node];
        }
    }

    update(mvvm, newVal) {
        for (let i = 0; i < this.nodes.length; i++) {
            this._update(this.nodes[i], newVal);
        }
    }

    bind(mvvm) {
        for (let i = 0; i < this.nodes.length; i++) {
            this._bind(this.nodes[i], newVal);
        }
    }
}

export default Directive;