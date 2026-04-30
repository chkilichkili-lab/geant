import React, { useState, useEffect, useMemo } from 'react';
import { Search, FileDown, Edit, Eye, Stethoscope, Plus, Trash2, X } from 'lucide-react';
import api from '../utils/api';
import './Accidents.css';

const Accidents = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [certFormData, setCertFormData] = useState({
    type: 'Initial',
    dateDebut: '',
    dateFin: '',
    description: ''
  });

  useEffect(() => {
    fetchAccidents();
  }, []);

  const fetchAccidents = async () => {
    try {
      const res = await api.get('/accidents');
      setAccidents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/accidents/${id}`, { statut: newStatus });
      fetchAccidents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      const res = await api.get(`/accidents/report/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_accident_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erreur lors du téléchargement du PDF', err);
    }
  };

  // Certificate logic
  const openCertModal = async (accident) => {
    setSelectedAccident(accident);
    setShowCertModal(true);
    fetchCertificates(accident._id);
  };

  const fetchCertificates = async (accidentId) => {
    try {
      const res = await api.get(`/certificates/${accidentId}`);
      setCertificates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCertInputChange = (e) => {
    setCertFormData({ ...certFormData, [e.target.name]: e.target.value });
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/certificates', { ...certFormData, accident: selectedAccident._id });
      setCertFormData({ type: 'Initial', dateDebut: '', dateFin: '', description: '' });
      fetchCertificates(selectedAccident._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCert = async (id) => {
    if (window.confirm('Supprimer ce certificat ?')) {
      try {
        await api.delete(`/certificates/${id}`);
        fetchCertificates(selectedAccident._id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'En cours': return 'badge-warning';
      case 'Clôturé': return 'badge-success';
      case 'En attente': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const getSeverityBadgeClass = (gravite) => {
    switch(gravite) {
      case 'Faible': return 'badge-info';
      case 'Moyenne': return 'badge-warning';
      case 'Grave': return 'badge-danger';
      case 'Critique': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const filteredAccidents = useMemo(() => {
    return accidents.filter(acc => 
      acc.employe?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.employe?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.lieu.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accidents, searchTerm]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dossiers d'Accidents</h1>
      </div>

      <div className="card">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, lieu..." 
            className="form-control pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employé</th>
                <th>Lieu</th>
                <th>Gravité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Chargement...</td></tr>
              ) : filteredAccidents.map(acc => (
                <tr key={acc._id}>
                  <td>{new Date(acc.dateAccident).toLocaleDateString()}</td>
                  <td>
                    <div className="font-medium">{acc.employe?.nom} {acc.employe?.prenom}</div>
                    <div className="text-sm text-muted">{acc.employe?.departement}</div>
                  </td>
                  <td>{acc.lieu}</td>
                  <td>
                    <span className={`badge ${getSeverityBadgeClass(acc.gravite)}`}>{acc.gravite}</span>
                  </td>
                  <td>
                    <select 
                      className={`status-select ${getStatusBadgeClass(acc.statut)}`}
                      value={acc.statut}
                      onChange={(e) => handleStatusChange(acc._id, e.target.value)}
                    >
                      <option value="En cours">En cours</option>
                      <option value="En attente">En attente</option>
                      <option value="Clôturé">Clôturé</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title="Certificats Médicaux"
                        onClick={() => openCertModal(acc)}
                      >
                        <Stethoscope size={18} />
                      </button>
                      <button 
                        className="btn-icon" 
                        title="Télécharger PDF"
                        onClick={() => handleDownloadPDF(acc._id)}
                      >
                        <FileDown size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredAccidents.length === 0 && (
                <tr><td colSpan="6" className="text-center">Aucun dossier trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertModal && selectedAccident && (
        <div className="modal-overlay">
          <div className="modal card cert-modal">
            <div className="modal-header">
              <h2>Certificats : {selectedAccident.employe?.nom} {selectedAccident.employe?.prenom}</h2>
              <button className="close-btn" onClick={() => setShowCertModal(false)}><X size={24} /></button>
            </div>
            
            <div className="cert-content">
              <div className="cert-list">
                <h3>Historique</h3>
                {certificates.length === 0 ? (
                  <p className="text-muted">Aucun certificat enregistré.</p>
                ) : (
                  <div className="timeline">
                    {certificates.map(cert => (
                      <div key={cert._id} className="timeline-item">
                        <div className="timeline-date">{new Date(cert.dateEmission).toLocaleDateString()}</div>
                        <div className="timeline-body">
                          <strong>{cert.type}</strong>
                          <div className="text-sm">Du {new Date(cert.dateDebut).toLocaleDateString()} {cert.dateFin && `au ${new Date(cert.dateFin).toLocaleDateString()}`}</div>
                          {cert.description && <p className="text-sm mt-1">{cert.description}</p>}
                          <button className="text-danger mt-2" onClick={() => handleDeleteCert(cert._id)}>
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="cert-form-wrapper">
                <h3>Ajouter un certificat</h3>
                <form onSubmit={handleAddCertificate} className="cert-form">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select name="type" className="form-control" value={certFormData.type} onChange={handleCertInputChange}>
                      <option value="Initial">Initial</option>
                      <option value="Prolongation">Prolongation</option>
                      <option value="Final">Final (Guérison)</option>
                      <option value="Reprise">Reprise de travail</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Début / Reprise</label>
                    <input type="date" name="dateDebut" className="form-control" required value={certFormData.dateDebut} onChange={handleCertInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Fin (si applicable)</label>
                    <input type="date" name="dateFin" className="form-control" value={certFormData.dateFin} onChange={handleCertInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes / Description</label>
                    <textarea name="description" className="form-control" rows="3" value={certFormData.description} onChange={handleCertInputChange}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-full mt-4">
                    <Plus size={18} /> Ajouter le certificat
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accidents;
