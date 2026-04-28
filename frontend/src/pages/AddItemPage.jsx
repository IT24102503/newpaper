import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const initialForm = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  discountPercentage: "",
  description: "",
};

function AddItemPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!form.name || !form.category || !form.price || !form.quantity || form.discountPercentage === "") {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(form.discountPercentage) < 0 || Number(form.discountPercentage) > 100) {
      setError("Discount Percentage must be between 0 and 100.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/items`, {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        discountPercentage: Number(form.discountPercentage),
      });
      setSuccess("Item added successfully!");
      setForm(initialForm);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add item. Make sure the backend server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Add New Item</h2>
      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Electronics, Clothing"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (LKR) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Task 02 - New field: Discount Percentage */}
          <div className="form-group">
            <label>Discount Percentage (%) *</label>
            <input
              type="number"
              name="discountPercentage"
              value={form.discountPercentage}
              onChange={handleChange}
              placeholder="Enter discount % (0 - 100)"
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description..."
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Item"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemPage;
