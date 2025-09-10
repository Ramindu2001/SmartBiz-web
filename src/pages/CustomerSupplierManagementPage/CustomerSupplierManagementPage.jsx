import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Tabs,
    Tab,
    Paper,
    InputAdornment,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material';

// Dummy data generator
const generateDummyData = () => [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-1234',
        notes: 'Preferred customer',
        transactions: [
            { id: 't1', date: '2023-12-01', amount: 250.00, type: 'sale' },
            { id: 't2', date: '2023-11-15', amount: 180.50, type: 'sale' },
            { id: 't3', date: '2023-10-28', amount: 320.75, type: 'sale' },
        ],
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-5678',
        notes: 'Corporate account',
        transactions: [
            { id: 't4', date: '2023-12-05', amount: 450.00, type: 'sale' },
            { id: 't5', date: '2023-11-20', amount: 290.25, type: 'sale' },
            { id: 't6', date: '2023-10-10', amount: 510.00, type: 'sale' },
        ],
    },
    {
        id: '3',
        name: 'Acme Corp',
        email: 'procurement@acme.com',
        phone: '+1-555-9012',
        notes: 'Bulk supplier',
        transactions: [
            { id: 't7', date: '2023-12-03', amount: 1200.00, type: 'purchase' },
            { id: 't8', date: '2023-11-18', amount: 950.75, type: 'purchase' },
            { id: 't9', date: '2023-10-05', amount: 1500.00, type: 'purchase' },
        ],
    },
];

// Component for displaying transaction history
const TransactionHistoryCell = ({ transactions }) => {
    const limitedTransactions = transactions.slice(0, 3);

    return (
        <Box>
            {limitedTransactions.map((transaction) => (
                <Box key={transaction.id} sx={{ mb: 0.5 }}>
                    <Typography variant="caption">
                        {transaction.date} - ${transaction.amount.toFixed(2)} ({transaction.type})
                    </Typography>
                </Box>
            ))}
            {transactions.length > 3 && (
                <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
                    +{transactions.length - 3} more
                </Typography>
            )}
        </Box>
    );
};

// Main component
const CustomerSupplierManagementPage = () => {
    // State for managing tab selection
    const [activeTab, setActiveTab] = useState('customers');

    // State for customers and suppliers (initially same dummy data)
    const [customers, setCustomers] = useState(generateDummyData().slice(0, 2));
    const [suppliers, setSuppliers] = useState(generateDummyData().slice(2));

    // State for search functionality
    const [searchTerm, setSearchTerm] = useState('');

    // State for dialog management
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [selectedItem, setSelectedItem] = useState(null);

    // State for form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: '',
    });

    // State for form validation
    const [formErrors, setFormErrors] = useState({
        name: false,
        email: false,
        phone: false,
    });

    // State for snackbar notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Filter data based on search term
    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSuppliers = suppliers.filter(
        (supplier) =>
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Open dialog for adding new item
    const handleAddClick = () => {
        setDialogMode('add');
        setSelectedItem(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            notes: '',
        });
        setFormErrors({ name: false, email: false, phone: false });
        setDialogOpen(true);
    };

    // Open dialog for editing item
    const handleEditClick = (item) => {
        setDialogMode('edit');
        setSelectedItem(item);
        setFormData({
            name: item.name,
            email: item.email,
            phone: item.phone,
            notes: item.notes || '',
        });
        setFormErrors({ name: false, email: false, phone: false });
        setDialogOpen(true);
    };

    // Close dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    // Validate form data
    const validateForm = () => {
        const errors = {
            name: !formData.name.trim(),
            email: !formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
            phone: !formData.phone.trim(),
        };

        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    // Handle form submission
    const handleFormSubmit = () => {
        if (!validateForm()) {
            return;
        }

        // Generate dummy transactions
        const generateTransactions = () => {
            const types = activeTab === 'customers' ? ['sale'] : ['purchase'];
            return Array.from({ length: 3 }, (_, i) => ({
                id: `t${Date.now()}-${i}`,
                date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                amount: Math.floor(Math.random() * 500) + 100,
                type: types[0],
            }));
        };

        if (dialogMode === 'add') {
            // Create new item
            const newItem = {
                id: `item-${Date.now()}`,
                ...formData,
                transactions: generateTransactions(),
            };

            if (activeTab === 'customers') {
                setCustomers((prev) => [...prev, newItem]);
            } else {
                setSuppliers((prev) => [...prev, newItem]);
            }

            setSnackbar({
                open: true,
                message: `${activeTab === 'customers' ? 'Customer' : 'Supplier'} added successfully!`,
                severity: 'success',
            });
        } else if (dialogMode === 'edit' && selectedItem) {
            // Update existing item
            const updatedItem = {
                ...selectedItem,
                ...formData,
            };

            if (activeTab === 'customers') {
                setCustomers((prev) =>
                    prev.map((item) => (item.id === selectedItem.id ? updatedItem : item))
                );
            } else {
                setSuppliers((prev) =>
                    prev.map((item) => (item.id === selectedItem.id ? updatedItem : item))
                );
            }

            setSnackbar({
                open: true,
                message: `${activeTab === 'customers' ? 'Customer' : 'Supplier'} updated successfully!`,
                severity: 'success',
            });
        }

        setDialogOpen(false);
    };

    // Handle delete item
    const handleDeleteClick = (id) => {
        if (window.confirm(`Are you sure you want to delete this ${activeTab === 'customers' ? 'customer' : 'supplier'}?`)) {
            if (activeTab === 'customers') {
                setCustomers((prev) => prev.filter((item) => item.id !== id));
            } else {
                setSuppliers((prev) => prev.filter((item) => item.id !== id));
            }

            setSnackbar({
                open: true,
                message: `${activeTab === 'customers' ? 'Customer' : 'Supplier'} deleted successfully!`,
                severity: 'success',
            });
        }
    };

    // Close snackbar
    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // Get current data based on active tab
    const currentData = activeTab === 'customers' ? filteredCustomers : filteredSuppliers;

    return (
        <Box sx={{ p: 4, background: '#f1f5f9', minHeight: '100vh' }}>
            <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Customer & Supplier Management
                </Typography>

                {/* Search Bar */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={`Search ${activeTab} by name or email...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                </Box>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{ mb: 3 }}
                >
                    <Tab value="customers" label="Customers" />
                    <Tab value="suppliers" label="Suppliers" />
                </Tabs>

                {/* Add Button */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                    >
                        Add {activeTab === 'customers' ? 'Customer' : 'Supplier'}
                    </Button>
                </Box>

                {/* Data Table */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Contact Info
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Transaction History
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Actions
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentData.length > 0 ? (
                                    currentData.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>
                                                <Typography>{item.name}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2">{item.email}</Typography>
                                                    <Typography variant="body2">{item.phone}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <TransactionHistoryCell transactions={item.transactions} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEditClick(item)}
                                                    aria-label="edit"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteClick(item.id)}
                                                    aria-label="delete"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <Typography variant="body1" color="text.secondary">
                                                No {activeTab} found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Dialog for Add/Edit */}
                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {dialogMode === 'add' ? 'Add New' : 'Edit'} {activeTab === 'customers' ? 'Customer' : 'Supplier'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={formErrors.name}
                                helperText={formErrors.name ? 'Name is required' : ''}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={formErrors.email}
                                helperText={formErrors.email ? 'Valid email is required' : ''}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                error={formErrors.phone}
                                helperText={formErrors.phone ? 'Phone is required' : ''}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Notes (Optional)"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                multiline
                                rows={3}
                                margin="normal"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleFormSubmit} variant="contained" color="primary">
                            {dialogMode === 'add' ? 'Add' : 'Update'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default CustomerSupplierManagementPage;