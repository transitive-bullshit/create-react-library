import React, { Component } from 'react';
import './App.css';

import ExampleComponent from '{{name}}';

class App extends Component {
  render() {
    return (
      <div>
        <ExampleComponent text="Modern React component module" />
      </div>
    );
  }
}

export default App;
