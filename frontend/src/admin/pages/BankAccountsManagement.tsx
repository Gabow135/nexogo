import React, { useState, useEffect } from 'react';
import { CuentaBancaria } from '../../types';
import { BankAccountFormData } from '../types';
import { adminBankAccountsService } from '../../services/api';
import './BankAccountsManagement.css';

const BankAccountsManagement: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<CuentaBancaria[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<CuentaBancaria | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      const accounts = await adminBankAccountsService.getAll();
      setBankAccounts(accounts);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    }
  };

  const [formData, setFormData] = useState<BankAccountFormData>({
    banco: '',
    tipo_cuenta: 'corriente',
    numero_cuenta: '',
    titular: '',
    cedula_ruc: '',
    email_contacto: '',
    activa: true
  });

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

  const openModal = (account?: CuentaBancaria) => {
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
    setLoading(true);

    try {
      if (editingAccount) {
        // Update existing account
        const response = await adminBankAccountsService.update(editingAccount.id!, formData);
        setBankAccounts(prev => prev.map(account => 
          account.id === editingAccount.id 
            ? response.bank_account
            : account
        ));
      } else {
        // Create new account
        const response = await adminBankAccountsService.create(formData);
        setBankAccounts(prev => [response.bank_account, ...prev]);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving bank account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const toggleAccount = async (id: number) => {
    try {
      const response = await adminBankAccountsService.toggle(id);
      setBankAccounts(prev => prev.map(account => 
        account.id === id 
          ? response.bank_account
          : account
      ));
    } catch (error) {
      console.error('Error toggling bank account:', error);
    }
  };

  const deleteAccount = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cuenta bancaria?')) {
      try {
        await adminBankAccountsService.delete(id);
        setBankAccounts(prev => prev.filter(account => account.id !== id));
      } catch (error) {
        console.error('Error deleting bank account:', error);
      }
    }
  };

  const getBankLogo = (banco: string) => {
    switch (banco.toLowerCase()) {
      case 'banco pichincha':
        return '🏦';
      case 'banco guayaquil':
        return '🏪';
      case 'jardín azuayo':
        return '🌺';
      default:
        return '🏛️';
    }
  };

  return (
    <div className="bank-accounts-management">
      <div className="page-header">
        <h1>Gestión de Cuentas Bancarias</h1>
        <p className="page-subtitle">
          Administra las cuentas bancarias para recibir pagos
        </p>
      </div>

      <div className="bank-accounts-actions">
        <button 
          className="btn btn-primary"
          onClick={() => openModal()}
        >
          ➕ Nueva Cuenta Bancaria
        </button>
      </div>

      <div className="admin-card">
        <div className="bank-accounts-grid">
          {bankAccounts.map((account) => (
            <div key={account.id} className={`bank-account-card ${!account.activa ? 'inactive' : ''}`}>
              <div className="bank-card-header">
                <span className="bank-logo">{getBankLogo(account.banco)}</span>
                <div className="bank-info">
                  <h3>{account.banco}</h3>
                  <span className="account-type">
                    {account.tipo_cuenta === 'corriente' ? 'Cuenta Corriente' : 'Cuenta de Ahorros'}
                  </span>
                </div>
                <span className={`status-indicator ${account.activa ? 'active' : 'inactive'}`}>
                  {account.activa ? '✅' : '❌'}
                </span>
              </div>

              <div className="bank-card-body">
                <div className="account-detail">
                  <span className="label">Número de cuenta:</span>
                  <span className="value">{account.numero_cuenta}</span>
                </div>
                <div className="account-detail">
                  <span className="label">Titular:</span>
                  <span className="value">{account.titular}</span>
                </div>
                <div className="account-detail">
                  <span className="label">Cédula/RUC:</span>
                  <span className="value">{account.cedula_ruc}</span>
                </div>
                <div className="account-detail">
                  <span className="label">Email:</span>
                  <span className="value">{account.email_contacto}</span>
                </div>
              </div>

              <div className="bank-card-actions">
                <button 
                  className="action-btn blue"
                  onClick={() => openModal(account)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  className={`action-btn ${account.activa ? 'orange' : 'green'}`}
                  onClick={() => toggleAccount(account.id)}
                  title={account.activa ? 'Desactivar' : 'Activar'}
                >
                  {account.activa ? '⏸️' : '▶️'}
                </button>
                <button 
                  className="action-btn red"
                  onClick={() => deleteAccount(account.id)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingAccount ? 'Editar Cuenta Bancaria' : 'Nueva Cuenta Bancaria'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="bank-account-form">
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

              <div className="form-row">
                <div className="form-group">
                  <label>Número de Cuenta *</label>
                  <input
                    type="text"
                    name="numero_cuenta"
                    value={formData.numero_cuenta}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 2212564018"
                  />
                </div>
                <div className="form-group">
                  <label>Titular de la Cuenta *</label>
                  <input
                    type="text"
                    name="titular"
                    value={formData.titular}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Dtiware SAS"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cédula/RUC *</label>
                  <input
                    type="text"
                    name="cedula_ruc"
                    value={formData.cedula_ruc}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 1891812025001"
                  />
                </div>
                <div className="form-group">
                  <label>Email de Contacto *</label>
                  <input
                    type="email"
                    name="email_contacto"
                    value={formData.email_contacto}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: info@empresa.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleInputChange}
                  />
                  Cuenta activa (visible para los clientes)
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : editingAccount ? 'Actualizar' : 'Crear'}
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