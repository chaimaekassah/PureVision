import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AppNavbar from '../components/AppNavbar';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const initials = user.nom
    ? user.nom.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : '?';

  const isAdmin = user.role === 'admin';

  // Format member since date
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    : 'Récemment';

  return (
    <div className="profile-page">
      <AppNavbar />

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="profile-container">
          <div className="profile-hero-inner">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-hero-info">
              <h1>{user.nom}</h1>
              <p>{user.email}</p>
              <span className={`role-badge ${isAdmin ? 'admin' : ''}`}>
                {isAdmin ? ' Admin' : '▶ Membre'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="profile-container">
        <div className="profile-content">

          {/* Stats */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon">🎬</div>
              <div className="stat-value">0</div>
              <div className="stat-label">Films regardés</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-value">0</div>
              <div className="stat-label">Favoris</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">0h</div>
              <div className="stat-label">Temps regardé</div>
            </div>
          </div>

          {/* Info Card */}
          <div style={{ marginTop: '32px' }}>
            <div className="section-title">Informations du compte</div>
            <div className="profile-card">

              <div className="profile-info">
                <div className="profile-info-left">
                  <div className="profile-label">Nom complet</div>
                  <div className="profile-value">{user.nom}</div>
                </div>

              </div>

              <div className="profile-info">
                <div className="profile-info-left">
                  <div className="profile-label">Adresse e-mail</div>
                  <div className="profile-value">{user.email}</div>
                </div>

              </div>

              <div className="profile-info">
                <div className="profile-info-left">
                  <div className="profile-label">Rôle</div>
                  <div className="profile-value">
                    <span className={`role-badge ${isAdmin ? 'admin' : ''}`}>
                      {isAdmin ? '⭐ Administrateur' : '▶ Utilisateur'}
                    </span>
                  </div>
                </div>

              </div>

              <div className="profile-info">
                <div className="profile-info-left">
                  <div className="profile-label">Membre depuis</div>
                  <div className="profile-value">{memberSince}</div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
