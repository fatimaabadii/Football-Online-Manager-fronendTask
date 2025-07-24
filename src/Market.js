import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Market() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [nameFilter, setNameFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  useEffect(() => {
    axios.get('http://localhost:5000/api/market', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setPlayers(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  const buyPlayer = async (playerId) => {
    try {
      await axios.post('http://localhost:5000/api/transfer/buy',
        { playerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Player bought!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error buying player');
    }
  };

  const fetchFilteredPlayers = async () => {
    try {
      const params = new URLSearchParams();
  
      if (nameFilter) params.append('name', nameFilter);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
  
      const res = await axios.get(`http://localhost:5000/api/market?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  

  if (loading) return <p className="text-center mt-5">Loading market...</p>;

  return (
    <div className="container my-5">
      <h2>Transfer Market</h2>

      <div className="card p-3 mb-4">
        <h5>Filter Players</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Player name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100" onClick={fetchFilteredPlayers}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {Array.isArray(players) && players.length > 0 ? (
        <ul className="list-group">
          {players.map(player => (
            <li key={player._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{player.name}</strong> — {player.position} — Asking: ${player.askingPrice.toLocaleString()} — Team: {player.teamId._id}
              </div>
              <button className="btn btn-success btn-sm" onClick={() => buyPlayer(player._id)}>
                Buy
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No players found</p>
      )}
    </div>
  );
}
