import React, { useState, useEffect } from 'react';
import { Activity, FolderOpen, CheckCircle, Clock } from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAccidents: 0,
    dossiersEnCours: 0,
    dossiersClotures: 0,
    dossiersEnAttente: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Chargement...</div>;

  const statCards = [
    { title: 'Total Accidents', value: stats.totalAccidents, icon: Activity, color: 'var(--primary)', bg: '#FEE2E2' },
    { title: 'Dossiers En Cours', value: stats.dossiersEnCours, icon: FolderOpen, color: '#F59E0B', bg: '#FEF3C7' },
    { title: 'Dossiers Clôturés', value: stats.dossiersClotures, icon: CheckCircle, color: '#10B981', bg: '#D1FAE5' },
    { title: 'En Attente', value: stats.dossiersEnAttente, icon: Clock, color: '#6B7280', bg: '#F3F4F6' }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: stat.bg, color: stat.color }}>
              <stat.icon size={28} />
            </div>
            <div className="stat-info">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h3>Bienvenue sur l'application de gestion des accidents</h3>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
            Utilisez le menu de gauche pour naviguer entre la gestion des employés, la déclaration de nouveaux accidents, ou le suivi des dossiers existants.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
