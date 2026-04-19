import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AppNavbar from '../components/AppNavbar';
import BrowseHero from '../components/BrowseHero';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';

const Browse = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get('/movies');
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message || 'Impossible de charger le catalogue.'
          );
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    if (!data?.movies?.length || !data.genres?.length) return [];
    const byGenre = data.movies.reduce((acc, m) => {
      if (!acc[m.genre]) acc[m.genre] = [];
      acc[m.genre].push(m);
      return acc;
    }, {});
    return data.genres.map((g) => ({ genre: g, movies: byGenre[g] || [] }));
  }, [data]);

  const featured = data?.featured;

  return (
    <div className="browse-page">
      <AppNavbar />
      <BrowseHero
        movie={featured}
        onPlay={(m) => {
          if (m?.video_url) navigate(`/watch/${m.id}`);
          else setSelected(m);
        }}
        onInfo={setSelected}
      />
      <div className="browse-content">
        {error && (
          <div className="browse-error global-error" style={{ margin: '24px 48px' }}>
            <span>⚠</span> {error}
          </div>
        )}
        {!data && !error && (
          <p className="browse-loading">Chargement du catalogue…</p>
        )}
        {rows.map(({ genre, movies }) => (
          <MovieRow
            key={genre}
            title={genre}
            movies={movies}
            onSelectMovie={setSelected}
          />
        ))}
      </div>
      {selected ? (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
};

export default Browse;
