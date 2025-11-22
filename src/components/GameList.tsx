import React, { useState, useEffect } from 'react';
import { gameService, healthCheck, Game, ApiResponse } from '../services/api';

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('checking');

  // Verificar conexión con el backend
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await healthCheck();
        setConnectionStatus('connected');
      } catch (err) {
        setConnectionStatus('disconnected');
        setError('No se puede conectar con el backend');
      }
    };

    checkConnection();
  }, []);

  // Cargar juegos
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Game[]> = await gameService.getAllGames();
        setGames(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar los juegos');
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    if (connectionStatus === 'connected') {
      fetchGames();
    }
  }, [connectionStatus]);

  if (loading) {
    return (
      <div className="loading">
        <p>🔄 Cargando juegos...</p>
      </div>
    );
  }

  return (
    <div className="game-list">
      <div className={`connection-status ${connectionStatus}`}>
        Estado de conexión: {connectionStatus === 'connected' ? '✅ Conectado' : '❌ Desconectado'}
      </div>

      <h2>🎮 Lista de Juegos</h2>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {games.length === 0 && !error ? (
        <p>No hay juegos disponibles</p>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <div className="game-meta">
                <span>🎯 {game.genre}</span>
                <span>🖥️ {game.platform}</span>
                {game.rating && <span>⭐ {game.rating}/10</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameList;