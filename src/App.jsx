import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [balance, setBalance] = useState(() => {
    return Number(localStorage.getItem("walletBalance")) || 0;
  });

  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem("walletTransactions")) || [];
  });

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("add");
  const [filter, setFilter] = useState("all");

  // Save wallet balance
  useEffect(() => {
    localStorage.setItem("walletBalance", balance);
  }, [balance]);

  // Save transaction history
  useEffect(() => {
    localStorage.setItem(
      "walletTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const addTransaction = (type, amount, description) => {
    const transaction = {
      id: Date.now(),
      type,
      amount,
      description,
      date: new Date().toLocaleString(),
    };

    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = Number(amount);

    if (!value || value <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (mode === "add") {
      setBalance((prev) => prev + value);
      addTransaction("income", value, description);
      alert("Money added successfully!");
    } else {
      if (value > balance) {
        alert("Insufficient balance!");
        return;
      }

      setBalance((prev) => prev - value);
      addTransaction("expense", value, description);
      alert("Payment successful!");
    }

    setAmount("");
    setDescription("");
  };

  const totalAdded = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  return (
    <div className="app">
      <header className="navbar">
        <h2>💳 PocketPay</h2>
        <span className="profile">My Wallet</span>
      </header>

      <section className="welcome">
        <h1>Digital Wallet</h1>
        <p>Manage your money easily and securely.</p>
      </section>

      {/* Balance Card */}
      <section className="balance-card">
        <p>Available Balance</p>
        <h1>{formatMoney(balance)}</h1>
        <span>Wallet Account •••• 2849</span>
      </section>

      <div className="dashboard">
        {/* Wallet Form */}
        <section className="card">
          <h2>Wallet Actions</h2>

          <div className="tabs">
            <button
              className={mode === "add" ? "active" : ""}
              onClick={() => setMode("add")}
            >
              + Add Money
            </button>

            <button
              className={mode === "spend" ? "active" : ""}
              onClick={() => setMode("spend")}
            >
              ↗ Pay / Expense
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <label>Description</label>
            <input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button type="submit" className="submit-btn">
              {mode === "add" ? "Add Money" : "Make Payment"}
            </button>
          </form>
        </section>

        {/* Wallet Overview */}
        <section className="card overview">
          <h2>Wallet Overview</h2>

          <div className="stat">
            <p>Total Money Added</p>
            <h3 className="income">{formatMoney(totalAdded)}</h3>
          </div>

          <div className="stat">
            <p>Total Money Spent</p>
            <h3 className="expense">{formatMoney(totalSpent)}</h3>
          </div>
        </section>

        {/* Transactions */}
        <section className="card transactions-card">
          <div className="transaction-header">
            <h2>Transaction History</h2>

            <div className="filters">
              <button
                className={filter === "all" ? "selected" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>

              <button
                className={filter === "income" ? "selected" : ""}
                onClick={() => setFilter("income")}
              >
                Added
              </button>

              <button
                className={filter === "expense" ? "selected" : ""}
                onClick={() => setFilter("expense")}
              >
                Spent
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="empty">No transactions available.</p>
          ) : (
            filteredTransactions.map((transaction) => (
              <div className="transaction" key={transaction.id}>
                <div className="transaction-info">
                  <div
                    className={`icon ${
                      transaction.type === "expense" ? "red" : "green"
                    }`}
                  >
                    {transaction.type === "income" ? "↓" : "↑"}
                  </div>

                  <div>
                    <h4>{transaction.description}</h4>
                    <p>{transaction.date}</p>
                    <small>
                      {transaction.type === "income"
                        ? "Money Added"
                        : "Payment / Expense"}
                    </small>
                  </div>
                </div>

                <h4
                  className={
                    transaction.type === "income" ? "income" : "expense"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatMoney(transaction.amount)}
                </h4>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default App;