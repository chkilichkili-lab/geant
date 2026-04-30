import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import api from '../utils/api';
import './Declaration.css';

const Declaration = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    employe: '',
    dateAccident: '',
    lieu: '',
    gravite: 'Faible',
    description: ''
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/accidents', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/accidents');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Déclarer un Accident</h1>
      </div>

      <div className="card declaration-card">
        {success && (
          <div className="success-message">
            Déclaration enregistrée avec succès. Redirection...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Employé concerné</label>
              <select 
                name="employe" 
                className="form-control" 
                required 
                value={formData.employe}
                onChange={handleChange}
              >
                <option value="">Sélectionner un employé</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.nom} {emp.prenom} - {emp.departement}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date de l'accident</label>
              <input 
                type="date" 
                name="dateAccident" 
                className="form-control" 
                required 
                value={formData.dateAccident}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lieu exact</label>
              <input 
                type="text" 
                name="lieu" 
                className="form-control" 
                required 
                placeholder="Ex: Entrepôt Rayon C"
                value={formData.lieu}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Niveau de gravité</label>
              <select 
                name="gravite" 
                className="form-control" 
                required
                value={formData.gravite}
                onChange={handleChange}
              >
                <option value="Faible">Faible (Premiers soins)</option>
                <option value="Moyenne">Moyenne (Arrêt de travail court)</option>
                <option value="Grave">Grave (Arrêt prolongé/Hôpital)</option>
                <option value="Critique">Critique</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Description détaillée des circonstances</label>
            <textarea 
              name="description" 
              className="form-control" 
              rows="5" 
              required
              placeholder="Décrivez précisément comment l'accident s'est produit..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={20} />
              {loading ? 'Enregistrement...' : 'Enregistrer la déclaration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Declaration;
