"use strict";

class Config {
  constructor() {
    this.logs = [];

    this.author = null;
    this.license = null;
    this.manager = null;
    this.template = null;
  }
}

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new Config();
    }
  }

  getInstance() {
    return Singleton.instance;
  }
}

module.exports = Singleton;
