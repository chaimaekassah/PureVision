import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/browse', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nom || !email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await register(nom, email, password, 'user');
      navigate('/browse');
    } catch (err) {
      const serverError =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Erreur lors de l'inscription";
      setError(serverError);
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
          <h1 className="auth-title">Créer un compte </h1>
          <p className="auth-subtitle">Rejoignez StreamNova et commencez à regarder</p>

          {error && (
            <div className="global-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="text"
                  className="form-input"

                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe</label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Répétez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              <span>{loading ? 'Création...' : 'Créer mon compte'}</span>
            </button>
          </form>

          <div className="auth-divider">ou</div>

          <div className="auth-footer">
            Déjà un compte ?
            <Link to="/login" className="auth-link">S'identifier</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
