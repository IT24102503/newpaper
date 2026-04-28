import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/items`);
      setItems(res.data.data);
    } catch {
      setError("Failed to fetch items. Make sure the backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/items/${id}`);
      setSuccessMsg("Item deleted successfully!");
      fetchItems();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Failed to delete item. Make sure the backend server is running on port 5000.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const discountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  return (
    <div>
      <h2 className="page-title">All Items</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {loading ? (
        <div className="loading">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>No items found</h3>
          <p>Click "Add Item" to add your first item.</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <div className="item-card" key={item._id}>
              <h3>{item.name}</h3>
              <p>
                <span>Category:</span> {item.category}
              </p>
              <p>
                <span>Price:</span> LKR {item.price.toFixed(2)}
              </p>
              <p>
                <span>Quantity:</span> {item.quantity}
              </p>
              {item.description && (
                <p>
                  <span>Description:</span> {item.description}
                </p>
              )}

              {/* Discount Percentage - Task 02 */}
              <span className="badge-discount">
                {item.discountPercentage}% Discount
              </span>
              <p style={{ marginTop: "6px" }}>
                <span>Discounted Price:</span> LKR{" "}
                {discountedPrice(item.price, item.discountPercentage)}
              </p>

              <div className="card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/edit/${item._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
