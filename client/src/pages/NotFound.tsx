import { Link } from 'react-router-dom';
// import './NotFound.css';

export default function NotFound() {
  return (
    <div className="Header-content flex items-center justify-center">
      <div className="row">
        <div className="col text-center mb-5">
          <h3>Uh oh, we could not find the page you were looking for!</h3>
          <p className="text-muted">
            <Link to="/">Return to the home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
