import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './BankAccountsManagement.css';

interface BankAccount {
  id: number;
  banco: string;
  tipo_cuenta: 'corriente' | 'ahorros';
  numero_cuenta: string;
  titular: string;
  cedula_ruc: string;
  email_contacto: string;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

interface BankAccountFormData {
  banco: string;
  tipo_cuenta: 'corriente' | 'ahorros';
  numero_cuenta: string;
  titular: string;
  cedula_ruc: string;
  email_contacto: string;
  activa: boolean;
}

const BankAccountsManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<BankAccountFormData>({
    banco: '',
    tipo_cuenta: 'corriente',
    numero_cuenta: '',
    titular: '',
    cedula_ruc: '',
    email_contacto: '',
    activa: true
  });

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBankAccounts();
      setAccounts(data);
      setError(null);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      setError('Error al cargar las cuentas bancarias');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      banco: '',
      tipo_cuenta: 'corriente',
      numero_cuenta: '',
      titular: '',
      cedula_ruc: '',
      email_contacto: '',
      activa: true
    });
    setEditingAccount(null);
  };

  const openModal = (account?: BankAccount) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        banco: account.banco,
        tipo_cuenta: account.tipo_cuenta,
        numero_cuenta: account.numero_cuenta,
        titular: account.titular,
        cedula_ruc: account.cedula_ruc,
        email_contacto: account.email_contacto,
        activa: account.activa
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAccount) {
        await apiService.updateBankAccount(editingAccount.id.toString(), formData);
      } else {
        await apiService.createBankAccount(formData);
      }

      await loadBankAccounts();
      closeModal();
    } catch (error) {
      console.error('Error saving bank account:', error);
      setError('Error al guardar la cuenta bancaria');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const deleteAccount = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cuenta bancaria?')) {
      try {
        setSubmitting(true);
        await apiService.deleteBankAccount(id.toString());
        await loadBankAccounts();
      } catch (error) {
        console.error('Error deleting bank account:', error);
        setError('Error al eliminar la cuenta bancaria');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      setSubmitting(true);
      await apiService.updateBankAccount(id.toString(), { activa: !currentStatus });
      await loadBankAccounts();
    } catch (error) {
      console.error('Error updating bank account status:', error);
      setError('Error al actualizar el estado de la cuenta');
    } finally {
      setSubmitting(false);
    }
  };

  const formatAccountNumber = (number: string) => {
    // Mask account number for security
    if (number.length <= 4) return number;
    const masked = '*'.repeat(number.length - 4) + number.slice(-4);
    return masked;
  };

  if (loading) {
    return (
      <div className="bank-accounts-management">
        <div className="page-header">
          <h1>Cuentas Bancarias</h1>
          <p className="page-subtitle">Administra las cuentas bancarias del sistema</p>
        </div>
        <div className="loading-state">
          <h2>Cargando cuentas bancarias...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bank-accounts-management">
      <div className="page-header">
        <h1>Cuentas Bancarias</h1>
        <p className="page-subtitle">
          Administra las cuentas bancarias para recibir pagos
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="accounts-actions">
        <button 
          className="btn btn-primary"
          onClick={() => openModal()}
          disabled={submitting}
        >
          ➕ Nueva Cuenta Bancaria
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏦</div>
          <h2>No hay cuentas bancarias configuradas</h2>
          <p>Agrega al menos una cuenta bancaria para recibir pagos de las actvidades.</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            Agregar Primera Cuenta
          </button>
        </div>
      ) : (
        <div className="admin-card">
          <div className="accounts-table">
            <table>
              <thead>
                <tr>
                  <th>Banco</th>
                  <th>Tipo</th>
                  <th>Número de Cuenta</th>
                  <th>Titular</th>
                  <th>Identificación</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>
                      <div className="bank-name">{account.banco}</div>
                    </td>
                    <td>
                      <span className={`account-type ${account.tipo_cuenta}`}>
                        {account.tipo_cuenta === 'corriente' ? 'Corriente' : 'Ahorros'}
                      </span>
                    </td>
                    <td>
                      <div className="account-number">
                        <span className="masked-number">{formatAccountNumber(account.numero_cuenta)}</span>
                        <span className="full-number">{account.numero_cuenta}</span>
                      </div>
                    </td>
                    <td>
                      <div className="holder-info">
                        <div className="holder-name">{account.titular}</div>
                      </div>
                    </td>
                    <td>
                      <span className="id-number">{account.cedula_ruc}</span>
                    </td>
                    <td>
                      <span className="email">{account.email_contacto}</span>
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${account.activa ? 'active' : 'inactive'}`}
                        onClick={() => toggleStatus(account.id, account.activa)}
                        disabled={submitting}
                      >
                        {account.activa ? '✅ Activa' : '❌ Inactiva'}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-btn blue"
                          onClick={() => openModal(account)}
                          title="Editar"
                          disabled={submitting}
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn red"
                          onClick={() => deleteAccount(account.id)}
                          title="Eliminar"
                          disabled={submitting}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingAccount ? 'Editar Cuenta Bancaria' : 'Nueva Cuenta Bancaria'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="account-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Banco *</label>
                  <input
                    type="text"
                    name="banco"
                    value={formData.banco}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Banco Pichincha"
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Cuenta *</label>
                  <select
                    name="tipo_cuenta"
                    value={formData.tipo_cuenta}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="corriente">Corriente</option>
                    <option value="ahorros">Ahorros</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Número de Cuenta *</label>
                <input
                  type="text"
                  name="numero_cuenta"
                  value={formData.numero_cuenta}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: 2100123456"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Titular de la Cuenta *</label>
                  <input
                    type="text"
                    name="titular"
                    value={formData.titular}
                    onChange={handleInputChange}
                    required
                    placeholder="Nombre completo del titular"
                  />
                </div>
                <div className="form-group">
                  <label>Cédula/RUC *</label>
                  <input
                    type="text"
                    name="cedula_ruc"
                    value={formData.cedula_ruc}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 1234567890"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email de Contacto *</label>
                <input
                  type="email"
                  name="email_contacto"
                  value={formData.email_contacto}
                  onChange={handleInputChange}
                  required
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleInputChange}
                  />
                  Cuenta activa
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Guardando...' : editingAccount ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountsManagement;