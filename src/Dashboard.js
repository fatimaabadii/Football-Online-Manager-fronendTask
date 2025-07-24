import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('No token found');
      window.location.href = '/';
      return;
    }

    axios.get('http://localhost:5000/api/team', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setTeam(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  const addToTransfer = async (playerId) => {
    const askingPrice = prompt('Set asking price:');
    if (!askingPrice) return;
    try {
      await axios.post('http://localhost:5000/api/transfer/add',
        { playerId, askingPrice },
        { headers: { Authorization: `Bearer ${token}` } });
      alert('Player added!');
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromTransfer = async (playerId) => {
    try {
      await axios.post('http://localhost:5000/api/transfer/remove',
        { playerId },
        { headers: { Authorization: `Bearer ${token}` } });
      alert('Player removed!');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container my-5">
      <h2>Your Team</h2>
      <p>Budget: ${team.budget.toLocaleString()}</p>

      <h3 className="mt-4">Players</h3>
      <ul className="list-group">
        {team.players.map(player => (
          <li key={player._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              {player.name} — {player.position} — ${player.price.toLocaleString()}
              {player.onTransferList && (
                <> [On Transfer] Asking: ${player.askingPrice || ''}</>
              )}
            </div>
            <div>
              {player.onTransferList ? (
                <button className="btn btn-danger btn-sm" onClick={() => removeFromTransfer(player._id)}>
                  Remove
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => addToTransfer(player._id)}>
                  Add to Transfer
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

