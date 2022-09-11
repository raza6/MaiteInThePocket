import { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './views/home/Home';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes>
          <Route index path="/" element={<Home/>}></Route>
        </Routes>
      </div>
    );
  }
}

export default App;
