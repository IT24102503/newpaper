import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>📦 Item Manager</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/add">Add Item</Link>
      </div>
    </nav>
  );
}

export default Navbar;