import React, { useState } from 'react';
import { FaHeadset, FaPlus, FaEdit, FaEye, FaSearch, FaReply } from 'react-icons/fa';
import './HelpdeskManagement.css';

const HelpdeskManagement = () => {
  const [tickets, setTickets] = useState([
    { id: 'TKT-2024-0156', customer: 'John Smith', subject: 'Login Issues', priority: 'High', status: 'Open', agent: 'Sarah Wilson', created: '2024-10-05', updated: '2024-10-05' },
    { id: 'TKT-2024-0155', customer: 'Emily Brown', subject: 'Password Reset', priority: 'Medium', status: 'In Progress', agent: 'Mike Johnson', created: '2024-10-04', updated: '2024-10-05' },
    { id: 'TKT-2024-0154', customer: 'Alex Davis', subject: 'System Error', priority: 'Critical', status: 'Open', agent: 'Unassigned', created: '2024-10-04', updated: '2024-10-04' },
    { id: 'TKT-2024-0153', customer: 'Lisa Garcia', subject: 'Feature Request', priority: 'Low', status: 'Resolved', agent: 'Tom Anderson', created: '2024-10-03', updated: '2024-10-04' },
    { id: 'TKT-2024-0152', customer: 'David Wilson', subject: 'Account Suspended', priority: 'High', status: 'Closed', agent: 'Sarah Wilson', created: '2024-10-02', updated: '2024-10-03' },
    { id: 'TKT-2024-0151', customer: 'Maria Rodriguez', subject: 'Billing Question', priority: 'Medium', status: 'In Progress', agent: 'Mike Johnson', created: '2024-10-02', updated: '2024-10-02' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const statuses = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];
  const agents = ['Unassigned', 'Sarah Wilson', 'Mike Johnson', 'Tom Anderson'];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { 
        ...ticket, 
        status: newStatus, 
        updated: new Date().toISOString().split('T')[0] 
      } : ticket
    ));
  };

  const handleAssignAgent = (ticketId, agent) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { 
        ...ticket, 
        agent: agent, 
        updated: new Date().toISOString().split('T')[0] 
      } : ticket
    ));
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#4caf50',
      'Medium': '#2196f3',
      'High': '#ff9800',
      'Critical': '#f44336'
    };
    return colors[priority] || '#666';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': '#ff9800',
      'In Progress': '#2196f3',
      'Resolved': '#4caf50',
      'Closed': '#666'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="helpdesk-management">
      <div className="management-header">
        <h2><FaHeadset /> Helpdesk Management</h2>
        <button className="btn btn-primary">
          <FaPlus /> Create New Ticket
        </button>
      </div>

      <div className="management-controls">
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tickets by ID, customer, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-section">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status} Status</option>
            ))}
          </select>
          
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority} Priority</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tickets-table">
        <div className="table-header">
          <div className="table-row header">
            <div className="table-cell">Ticket ID</div>
            <div className="table-cell">Customer</div>
            <div className="table-cell">Subject</div>
            <div className="table-cell">Priority</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Agent</div>
            <div className="table-cell">Created</div>
            <div className="table-cell">Actions</div>
          </div>
        </div>
        
        <div className="table-body">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="table-row">
              <div className="table-cell">
                <span className="ticket-id">{ticket.id}</span>
              </div>
              <div className="table-cell">
                <div className="customer-info">
                  <div className="customer-avatar">{ticket.customer.charAt(0)}</div>
                  <span className="customer-name">{ticket.customer}</span>
                </div>
              </div>
              <div className="table-cell">
                <span className="ticket-subject">{ticket.subject}</span>
              </div>
              <div className="table-cell">
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                >
                  {ticket.priority}
                </span>
              </div>
              <div className="table-cell">
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                  className="status-select"
                  style={{ borderColor: getStatusColor(ticket.status) }}
                >
                  {statuses.slice(1).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="table-cell">
                <select
                  value={ticket.agent}
                  onChange={(e) => handleAssignAgent(ticket.id, e.target.value)}
                  className="agent-select"
                >
                  {agents.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
              <div className="table-cell">{ticket.created}</div>
              <div className="table-cell">
                <div className="actions">
                  <button 
                    className="action-btn view"
                    onClick={() => handleViewTicket(ticket)}
                    title="View Ticket Details"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn edit"
                    title="Edit Ticket"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn reply"
                    title="Reply to Ticket"
                  >
                    <FaReply />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {filteredTickets.length === 0 && (
        <div className="no-results">
          <p>No tickets found matching your criteria.</p>
        </div>
      )}

      {showTicketDetails && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowTicketDetails(false)}>
          <div className="ticket-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ticket Details - {selectedTicket.id}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowTicketDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedTicket.customer}</p>
                <p><strong>Created:</strong> {selectedTicket.created}</p>
                <p><strong>Last Updated:</strong> {selectedTicket.updated}</p>
              </div>
              <div className="detail-section">
                <h4>Ticket Information</h4>
                <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                <p><strong>Priority:</strong> 
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(selectedTicket.priority) }}
                  >
                    {selectedTicket.priority}
                  </span>
                </p>
                <p><strong>Status:</strong> 
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedTicket.status) }}
                  >
                    {selectedTicket.status}
                  </span>
                </p>
                <p><strong>Assigned Agent:</strong> {selectedTicket.agent}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpdeskManagement;
