import './App.css';
import Formula from './formula/Formula';

function App() {
  return (
    <>
      <nav className="navbar is-dark">
        <div className="navbar-brand">
          <a className="navbar-item" href="#">Toolbar</a>
        </div>
      </nav>
      <div className="container is-max-desktop">
        <Formula />
      </div>
    </>
  );
}

export default App;
