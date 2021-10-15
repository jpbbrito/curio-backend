class Container {
  constructor() {
    this.services = {};
  }

  services(name, callback) {
    Object.defineProperty(this, name, {
      get: () => {
        // eslint-disable-next-line no-prototype-builtins
        if (!this.services.hasOwnProperty(name)) {
          this.services[name] = callback(this);
        }
        return this.services[name];
      },
      configurable: true,
      enumerable: true,
    });
    return this;
  }
}

module.exports = Container;
