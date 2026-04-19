import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/browse', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <div className="auth-logo">▶ StreamNova</div>
      </header>

      <div className="auth-center">
        <div className="auth-box">
          <h1 className="auth-title">Bon retour </h1>
          <p className="auth-subtitle">Connectez-vous pour continuer à regarder</p>

          {error && (
            <div className="global-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Adresse e-mail</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  className="form-input"

                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              <span>{loading ? 'Connexion...' : 'S\'identifier'}</span>
            </button>
          </form>

          <div className="auth-divider">ou</div>

          <div className="auth-footer">
            Première visite sur StreamNova ?
            <Link to="/register" className="auth-link">Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
