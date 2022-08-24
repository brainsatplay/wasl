import getFnParamInfo from "src/common/utils/parse";

class ESComponent {
  tag: string;
  graph: any;
  nested: any;
  parent: any;
  [x: string]: any; // flattened node

  // Components
  element?: HTMLElement;
  parentNode?: HTMLElement;
  tagName?: string;
  style?: string;
  attributes?: { [x: string]: any };

  constructor(tag, node, options) {
    this.tag = tag;
    Object.assign(this, node);

    // Catch Nested Graphs (overwrite graph key...)

    if (options.parent?.graph) this.parent = options.parent.graph;

    // Load Graphs Normally
    else this.parent = options.parent;

    // Convert Nodes in the Graph to ESComponents
    if ('graph' in this) {
      for (let name in this.nodes) {
        const node = this.nodes[name];
        if (!(node instanceof ESComponent)) this.nodes[name] = new ESComponent(name, node, {
          parent: this, 
          activate: options.activate
        }); // turn into a component
      }
    }

    // Is a Node
    else {

      if (options._arguments !== false){
      const args = getFnParamInfo(node.default) ?? new Map();
      if (args.size === 0) args.set("default", {});

      // merge with user-specified arguments
      if (this.arguments) {
        for (let key in this.arguments) {
          const o = args.get(key);
          o.state = this.arguments[key];
        }
      }

      this.arguments = args;

        this.graph = { nodes: {} };

        Array.from(args.entries()).forEach(([arg], i) => {
          const module = {
            default: async (input) => {
              const o = args.get(arg);
              o.state = input;
              if (i === 0)
                return await this.run(); // first argument is a proxy for this node
              else return input;
            },
          };

          this.graph.nodes[arg] = new ESComponent(arg, module, {
            parent: this,
            activate: options.activate,
            _arguments: false
          });
        });

        // Create Proper Global Operator for the Instance
        const originalDefault = this.default;
        originalDefault.bind(this);

        this.default = async (...argsArr) => {
          let updatedArgs = [];
          let i = 0;
          args.forEach((o, k) => {
            const argO = args.get(k);
            const currentArg = argO.spread ? argsArr.slice(i) : argsArr[i];
            let update = currentArg !== undefined ? currentArg : o.state;
            argO.state = update;
            if (!argO.spread) update = [update];
            updatedArgs.push(...update);
            i++;
          });

          return await originalDefault(...updatedArgs);
        };
      }
    }

    // ---------------------- WASL Support ----------------------
    if (options.activate !== false) {
      if (typeof this.oncreate === "function") this.oncreate(); // oncreate support
      if (this.loop) {
        setInterval(() => {
          this.run();
        }, this.loop);
      }

      // Basic Element Support
      if (!this.parentNode) this.parentNode = document.body;

      if (this.tagName) this.element = document.createElement(this.tagName);

      if (this.element) {
        this.parentNode.appendChild(this.element); // add to DOM

        if (this.attributes) {
          for (let attribute in this.attributes) {
            const value = this.attributes[attribute];
            if (typeof value === "function") {
              const boundValue = value.bind(this);
              this.element[attribute] = (ev) => boundValue(ev);
            } else this.element[attribute] = value;
          }
        }
        if (typeof this.onrender === "function") this.onrender(); // onrender support
      }
    }

  }

  run = async (...args) => {
    const results: any = {
      default: undefined,
      children: {},
    };

    // Is a Graph
    if (this.graph) {
      const input = this.ports?.input;
      if (input) {
        const output = this.ports?.output;
        const node = this.nodes[input];
        const res = await node.run(...args);
        results.default = res.children[output].default;
      }
    }

    // Is a Node
    else results.default = await this.default(...args); // check if defined

    // Forward Result to Children
    if (results.default !== undefined) {
      // run children if defined

      const edgesTarget = this;
      const runIfMatch = async (target: any, tag?: string) => {
        const newTag = tag ? `${target.tag}.${tag}` : target.tag;

        if (target?.graph?.edges) {
          for (let tag in target.graph.edges[newTag]) {
            let toRun = target.graph;
            tag.split(".").forEach((str) => (toRun = toRun.nodes[str])); // drill based on separator
            const args = !Array.isArray(results.default)
              ? [results.default]
              : results.default; // handle non-arrays
            results.children[tag] = await toRun.run(...args);
          }
        }

        if (target.parent) await runIfMatch(target.parent, newTag); // move upwards in the graph hierarchy
      };

      await runIfMatch(edgesTarget);
    }

    return results;
  };
}

export default ESComponent;
