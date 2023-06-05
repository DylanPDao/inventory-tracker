import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Header />} />
      </Routes>
    </div>
  );
}

export default App;
