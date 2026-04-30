import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import api from '../utils/api';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', departement: '', poste: '', email: '', telephone: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post('/employees', formData);
      setShowAddModal(false);
      setFormData({ nom: '', prenom: '', departement: '', poste: '', email: '', telephone: '' });
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || err.response?.data || 'Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      nom: emp.nom,
      prenom: emp.prenom,
      departement: emp.departement,
      poste: emp.poste,
      email: emp.email || '',
      telephone: emp.telephone || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await api.put(`/employees/${editingEmployee._id}`, formData);
      setShowEditModal(false);
      setEditingEmployee(null);
      setFormData({ nom: '', prenom: '', departement: '', poste: '', email: '', telephone: '' });
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || err.response?.data || 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet employé ?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.departement.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestion des Employés</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un employé..." 
            className="form-control pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nom & Prénom</th>
                <th>Département</th>
                <th>Poste</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center">Chargement...</td></tr>
              ) : filteredEmployees.map(emp => (
                <tr key={emp._id}>
                  <td>
                    <div className="font-medium">{emp.nom} {emp.prenom}</div>
                  </td>
                  <td>{emp.departement}</td>
                  <td>{emp.poste}</td>
                  <td>
                    <div className="text-sm">{emp.email}</div>
                    <div className="text-sm text-muted">{emp.telephone}</div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon text-primary" onClick={() => handleEditClick(emp)} title="Modifier">
                        <Edit size={18} />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(emp._id)} title="Supprimer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredEmployees.length === 0 && (
                <tr><td colSpan="5" className="text-center">Aucun employé trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <div className="modal-header">
              <h2>Ajouter un employé</h2>
            </div>
            <form onSubmit={handleAddEmployee}>
              {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input 
                    type="text" 
                    name="nom" 
                    className="form-control" 
                    required 
                    value={formData.nom}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input 
                    type="text" 
                    name="prenom" 
                    className="form-control" 
                    required 
                    value={formData.prenom}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Département</label>
                  <input 
                    type="text" 
                    name="departement" 
                    className="form-control" 
                    required 
                    value={formData.departement}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Poste</label>
                  <input 
                    type="text" 
                    name="poste" 
                    className="form-control" 
                    required 
                    value={formData.poste}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    value={formData.email}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input 
                    type="text" 
                    name="telephone" 
                    className="form-control" 
                    value={formData.telephone}
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowAddModal(false); setError(null); }}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <div className="modal-header">
              <h2>Modifier l'employé</h2>
            </div>
            <form onSubmit={handleUpdateEmployee}>
              {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input 
                    type="text" 
                    name="nom" 
                    className="form-control" 
                    required 
                    value={formData.nom}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input 
                    type="text" 
                    name="prenom" 
                    className="form-control" 
                    required 
                    value={formData.prenom}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Département</label>
                  <input 
                    type="text" 
                    name="departement" 
                    className="form-control" 
                    required 
                    value={formData.departement}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Poste</label>
                  <input 
                    type="text" 
                    name="poste" 
                    className="form-control" 
                    required 
                    value={formData.poste}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    value={formData.email}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input 
                    type="text" 
                    name="telephone" 
                    className="form-control" 
                    value={formData.telephone}
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowEditModal(false); setEditingEmployee(null); setError(null); }}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
