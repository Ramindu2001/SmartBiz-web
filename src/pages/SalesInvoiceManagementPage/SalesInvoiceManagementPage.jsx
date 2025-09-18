import React, { useState, useEffect } from 'react';
import {
    Box,
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
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Chip,
    Snackbar,
    Alert,
    Grid,
    IconButton,
    Drawer,
    Divider,
    Autocomplete,
    Paper,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    Print as PrintIcon,
    Email as EmailIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Remove as RemoveIcon,
} from '@mui/icons-material';

// Dummy products for sale selection
const DUMMY_PRODUCTS = [
    { id: 'p1', name: 'Wireless Headphones', price: 89.99 },
    { id: 'p2', name: 'Cotton T-Shirt', price: 19.99 },
    { id: 'p3', name: 'Organic Apples (1kg)', price: 4.99 },
    { id: 'p4', name: 'Coffee Maker', price: 79.99 },
    { id: 'p5', name: 'Lego Set', price: 49.99 },
];

// Dummy customers for autocomplete
const DUMMY_CUSTOMERS = [
    'John Doe',
    'Jane Smith',
    'Acme Corporation',
    'Tech Solutions Inc.',
    'Global Retail Ltd.',
    'Sarah Johnson',
    'Michael Brown',
];

// Main Sales & Invoice Management Component
const SalesInvoiceManagementPage = () => {
    // State for sales form
    const [customerName, setCustomerName] = useState('');
    const [products, setProducts] = useState([
        { id: '', quantity: 1, pricePerUnit: 0, total: 0 }
    ]);
    const [totalAmount, setTotalAmount] = useState(0);

    // State for invoices
    const [invoices, setInvoices] = useState([
        {
            id: 'INV-001',
            customerName: 'John Doe',
            date: '2023-12-01',
            amount: 179.98,
            status: 'Paid',
            items: [
                { productName: 'Wireless Headphones', quantity: 2, price: 89.99, total: 179.98 }
            ]
        },
        {
            id: 'INV-002',
            customerName: 'Jane Smith',
            date: '2023-12-03',
            amount: 59.97,
            status: 'Pending',
            items: [
                { productName: 'Organic Apples (1kg)', quantity: 12, price: 4.99, total: 59.88 }
            ]
        },
        {
            id: 'INV-003',
            customerName: 'Acme Corporation',
            date: '2023-12-05',
            amount: 399.95,
            status: 'Paid',
            items: [
                { productName: 'Coffee Maker', quantity: 5, price: 79.99, total: 399.95 }
            ]
        }
    ]);

    // State for filtering and searching
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // State for dialogs and drawers
    const [saleDialogOpen, setSaleDialogOpen] = useState(false);
    const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // State for notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Update total amount when products change
    useEffect(() => {
        const newTotal = products.reduce((sum, product) => {
            if (product.id) {
                const prod = DUMMY_PRODUCTS.find(p => p.id === product.id);
                if (prod) {
                    const itemTotal = prod.price * (product.quantity || 1);
                    return sum + itemTotal;
                }
            }
            return sum;
        }, 0);
        setTotalAmount(newTotal);
    }, [products]);

    // Filter invoices based on status and search term
    const filteredInvoices = invoices.filter(invoice => {
        const matchesStatus = filterStatus === 'All' || invoice.status === filterStatus;
        const matchesSearch =
            invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Open sale dialog
    const handleOpenSaleDialog = () => {
        setSaleDialogOpen(true);
        // Reset form
        setCustomerName('');
        setProducts([{ id: '', quantity: 1, pricePerUnit: 0, total: 0 }]);
        setTotalAmount(0);
    };

    // Close sale dialog
    const handleCloseSaleDialog = () => {
        setSaleDialogOpen(false);
    };

    // Handle adding a new product row
    const handleAddProduct = () => {
        setProducts(prev => [...prev, { id: '', quantity: 1, pricePerUnit: 0, total: 0 }]);
    };

    // Handle removing a product row
    const handleRemoveProduct = (index) => {
        if (products.length > 1) {
            setProducts(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Handle product selection change
    const handleProductChange = (index, productId) => {
        const updatedProducts = [...products];
        updatedProducts[index].id = productId;

        if (productId) {
            const product = DUMMY_PRODUCTS.find(p => p.id === productId);
            if (product) {
                updatedProducts[index].pricePerUnit = product.price;
                updatedProducts[index].total = product.price * (updatedProducts[index].quantity || 1);
            }
        } else {
            updatedProducts[index].pricePerUnit = 0;
            updatedProducts[index].total = 0;
        }

        setProducts(updatedProducts);
    };

    // Handle quantity change
    const handleQuantityChange = (index, value) => {
        const updatedProducts = [...products];
        const quantity = parseInt(value) || 0;
        updatedProducts[index].quantity = quantity;

        if (updatedProducts[index].id) {
            const product = DUMMY_PRODUCTS.find(p => p.id === updatedProducts[index].id);
            if (product) {
                updatedProducts[index].total = product.price * quantity;
            }
        }

        setProducts(updatedProducts);
    };

    // Handle form submission for new sale
    const handleSaleSubmit = () => {
        if (!customerName.trim()) {
            setSnackbar({
                open: true,
                message: 'Please enter customer name',
                severity: 'error'
            });
            return;
        }

        // Validate at least one product is selected
        const hasValidProduct = products.some(product => product.id && product.quantity > 0);
        if (!hasValidProduct) {
            setSnackbar({
                open: true,
                message: 'Please add at least one product with valid quantity',
                severity: 'error'
            });
            return;
        }

        // Generate invoice ID
        const invoiceId = `INV-${String(invoices.length + 1).padStart(3, '0')}`;

        // Create items array
        const items = products
            .filter(product => product.id && product.quantity > 0)
            .map(product => {
                const prod = DUMMY_PRODUCTS.find(p => p.id === product.id);
                return {
                    productName: prod.name,
                    quantity: product.quantity,
                    price: prod.price,
                    total: prod.price * product.quantity
                };
            });

        // Create new invoice
        const newInvoice = {
            id: invoiceId,
            customerName: customerName.trim(),
            date: new Date().toISOString().split('T')[0],
            amount: totalAmount,
            status: 'Pending',
            items: items
        };

        // Add to invoices state
        setInvoices(prev => [...prev, newInvoice]);

        // Show success message
        setSnackbar({
            open: true,
            message: `Sale recorded successfully! Invoice ${invoiceId} created.`,
            severity: 'success'
        });

        // Close dialog
        setSaleDialogOpen(false);
    };

    // Open invoice drawer
    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setInvoiceDrawerOpen(true);
    };

    // Close invoice drawer
    const handleCloseInvoiceDrawer = () => {
        setInvoiceDrawerOpen(false);
        setSelectedInvoice(null);
    };

    // Mark invoice as paid
    const handleMarkAsPaid = (invoiceId) => {
        setInvoices(prev =>
            prev.map(invoice =>
                invoice.id === invoiceId
                    ? { ...invoice, status: 'Paid' }
                    : invoice
            )
        );

        setSnackbar({
            open: true,
            message: `Invoice ${invoiceId} marked as paid!`,
            severity: 'success'
        });
    };

    // Delete invoice
    const handleDeleteInvoice = (invoiceId) => {
        if (window.confirm(`Are you sure you want to delete invoice ${invoiceId}?`)) {
            setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));

            setSnackbar({
                open: true,
                message: `Invoice ${invoiceId} deleted successfully!`,
                severity: 'success'
            });
        }
    };

    // Simulate sending email
    const handleSendEmail = (invoiceId) => {
        setSnackbar({
            open: true,
            message: `Email sent for invoice ${invoiceId}!`,
            severity: 'success'
        });
    };

    // Simulate printing invoice
    const handlePrintInvoice = (invoiceId) => {
        setSnackbar({
            open: true,
            message: `Print preview opened for invoice ${invoiceId}!`,
            severity: 'info'
        });
    };

    // Close snackbar
    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Sales & Invoice Management
            </Typography>

            {/* Sales Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Record New Sale
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenSaleDialog}
                                >
                                    New Sale
                                </Button>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Fill out the form to record a new sale and generate an invoice automatically.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Invoice Management Section */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Invoices
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            {/* Status Filter */}
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filterStatus}
                                    label="Status"
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Paid">Paid</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Search Bar */}
                            <TextField
                                size="small"
                                placeholder="Search by customer or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} />
                                    ),
                                }}
                                sx={{ width: 250 }}
                            />
                        </Box>
                    </Box>

                    {/* Invoices Table */}
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Invoice ID
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Customer
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Date
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Amount
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Status
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
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((invoice) => (
                                    <TableRow key={invoice.id} hover>
                                        <TableCell>
                                            <Typography sx={{ fontFamily: 'monospace' }}>
                                                {invoice.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{invoice.customerName}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{invoice.date}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight="bold">
                                                ${invoice.amount.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={invoice.status}
                                                color={invoice.status === 'Paid' ? 'success' : 'warning'}
                                                size="small"
                                                icon={
                                                    invoice.status === 'Paid' ?
                                                        <CheckCircleIcon /> :
                                                        <CancelIcon />
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleViewInvoice(invoice)}
                                                aria-label="view"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteInvoice(invoice.id)}
                                                aria-label="delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                                            No invoices found. Record a new sale to generate an invoice.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Sale Dialog */}
            <Dialog open={saleDialogOpen} onClose={handleCloseSaleDialog} maxWidth="md" fullWidth>
                <DialogTitle>Record New Sale</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Autocomplete
                            freeSolo
                            options={DUMMY_CUSTOMERS}
                            value={customerName}
                            onChange={(event, newValue) => setCustomerName(newValue || '')}
                            onInputChange={(event, newInputValue) => setCustomerName(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Customer Name"
                                    margin="normal"
                                    required
                                />
                            )}
                        />

                        {/* Products Section */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                Products
                            </Typography>

                            {products.map((product, index) => (
                                <Box key={index} sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1
                                }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Product</InputLabel>
                                        <Select
                                            value={product.id}
                                            label="Product"
                                            onChange={(e) => handleProductChange(index, e.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>Select Product</em>
                                            </MenuItem>
                                            {DUMMY_PRODUCTS.map((prod) => (
                                                <MenuItem key={prod.id} value={prod.id}>
                                                    {prod.name} - ${prod.price.toFixed(2)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        inputProps={{ min: 1, step: 1 }}
                                        sx={{ width: 100 }}
                                    />

                                    {product.id && (
                                        <>
                                            <TextField
                                                label="Price"
                                                type="number"
                                                value={DUMMY_PRODUCTS.find(p => p.id === product.id)?.price || 0}
                                                InputProps={{
                                                    readOnly: true,
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                sx={{ width: 120 }}
                                            />

                                            <TextField
                                                label="Total"
                                                type="number"
                                                value={(DUMMY_PRODUCTS.find(p => p.id === product.id)?.price || 0) * (product.quantity || 0)}
                                                InputProps={{
                                                    readOnly: true,
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                sx={{ width: 120 }}
                                            />
                                        </>
                                    )}

                                    {products.length > 1 && (
                                        <IconButton
                                            onClick={() => handleRemoveProduct(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}

                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddProduct}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            >
                                Add Product
                            </Button>

                            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Total Amount: ${totalAmount.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSaleDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaleSubmit} variant="contained" color="primary">
                        Record Sale
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Invoice Drawer */}
            <Drawer
                anchor="right"
                open={invoiceDrawerOpen}
                onClose={handleCloseInvoiceDrawer}
                PaperProps={{
                    sx: { width: { xs: '100%', sm: '500px' } }
                }}
            >
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Fixed Header */}
                    <Box sx={{
                        p: 3,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6" fontWeight="bold">
                            Invoice Details
                        </Typography>
                        <IconButton onClick={handleCloseInvoiceDrawer}>
                            <CancelIcon />
                        </IconButton>
                    </Box>

                    {/* Scrollable Content */}
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 3
                    }}>
                        {selectedInvoice && (
                            <>
                                <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h5" fontWeight="bold">
                                            {selectedInvoice.id}
                                        </Typography>
                                        <Chip
                                            label={selectedInvoice.status}
                                            color={selectedInvoice.status === 'Paid' ? 'success' : 'warning'}
                                            icon={
                                                selectedInvoice.status === 'Paid' ?
                                                    <CheckCircleIcon /> :
                                                    <CancelIcon />
                                            }
                                        />
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Customer
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {selectedInvoice.customerName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Date
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {selectedInvoice.date}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    Items
                                </Typography>

                                {selectedInvoice.items.map((item, index) => (
                                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="medium">
                                                {item.productName}
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight="medium">
                                                ${item.total.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">
                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                ))}

                                <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Total Amount: ${selectedInvoice.amount.toFixed(2)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PrintIcon />}
                                        onClick={() => handlePrintInvoice(selectedInvoice.id)}
                                        fullWidth
                                    >
                                        Print
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EmailIcon />}
                                        onClick={() => handleSendEmail(selectedInvoice.id)}
                                        fullWidth
                                    >
                                        Email
                                    </Button>
                                </Box>

                                {selectedInvoice.status === 'Pending' && (
                                    <Button
                                        variant="contained"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => {
                                            handleMarkAsPaid(selectedInvoice.id);
                                            handleCloseInvoiceDrawer();
                                        }}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Mark as Paid
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Drawer>

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
    );
};

export default SalesInvoiceManagementPage;