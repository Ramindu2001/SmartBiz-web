import React, { useState } from 'react';
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
    IconButton,
    Select,
    MenuItem,
    InputAdornment,
    Snackbar,
    Alert,
    Grid,
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';

// Dummy categories for the product form
const CATEGORIES = ['Electronics', 'Clothing', 'Grocery', 'Home & Garden', 'Toys', 'Sports'];

// Generate initial dummy product data
const generateDummyProducts = () => [
    {
        id: 'p1',
        name: 'Wireless Headphones',
        category: 'Electronics',
        price: 89.99,
        stockLevel: 15,
        minStockLevel: 20,
        barcode: 'WH-001-2023',
    },
    {
        id: 'p2',
        name: 'Cotton T-Shirt',
        category: 'Clothing',
        price: 19.99,
        stockLevel: 50,
        minStockLevel: 30,
        barcode: 'CT-002-2023',
    },
    {
        id: 'p3',
        name: 'Organic Apples',
        category: 'Grocery',
        price: 4.99,
        stockLevel: 8,
        minStockLevel: 25,
        barcode: 'OA-003-2023',
    },
    {
        id: 'p4',
        name: 'Coffee Maker',
        category: 'Home & Garden',
        price: 79.99,
        stockLevel: 12,
        minStockLevel: 10,
        barcode: 'CM-004-2023',
    },
    {
        id: 'p5',
        name: 'Lego Set',
        category: 'Toys',
        price: 49.99,
        stockLevel: 3,
        minStockLevel: 15,
        barcode: 'LS-005-2023',
    },
];

// Main Product Stock Management Component
const ProductStockManagementPage = () => {
    // State for products list
    const [products, setProducts] = useState(generateDummyProducts());

    // State for search functionality
    const [searchTerm, setSearchTerm] = useState('');

    // State for dialog management
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
    const [selectedProduct, setSelectedProduct] = useState(null);

    // State for form data
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stockLevel: '',
        minStockLevel: '',
        barcode: '',
    });

    // State for form validation errors
    const [formErrors, setFormErrors] = useState({
        name: false,
        category: false,
        price: false,
        stockLevel: false,
        minStockLevel: false,
        barcode: false,
        barcodeDuplicate: false,
    });

    // State for snackbar notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success', 'error', 'warning', 'info'
    });

    // Filter products based on search term (search by name or category)
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Check if a product is low stock
    const isLowStock = (product) => {
        return product.stockLevel < product.minStockLevel;
    };

    // Open dialog for adding new product
    const handleAddClick = () => {
        setDialogMode('add');
        setSelectedProduct(null);
        setFormData({
            name: '',
            category: '',
            price: '',
            stockLevel: '',
            minStockLevel: '',
            barcode: '',
        });
        setFormErrors({
            name: false,
            category: false,
            price: false,
            stockLevel: false,
            minStockLevel: false,
            barcode: false,
            barcodeDuplicate: false,
        });
        setDialogOpen(true);
    };

    // Open dialog for editing existing product
    const handleEditClick = (product) => {
        setDialogMode('edit');
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            stockLevel: product.stockLevel.toString(),
            minStockLevel: product.minStockLevel.toString(),
            barcode: product.barcode,
        });
        setFormErrors({
            name: false,
            category: false,
            price: false,
            stockLevel: false,
            minStockLevel: false,
            barcode: false,
            barcodeDuplicate: false,
        });
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

        // Clear error for this field when user types
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: false, barcodeDuplicate: false }));
        }
    };

    // Validate form data
    const validateForm = () => {
        // Check required fields
        const errors = {
            name: !formData.name.trim(),
            category: !formData.category.trim(),
            price: !formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0,
            stockLevel: !formData.stockLevel || isNaN(formData.stockLevel) || parseInt(formData.stockLevel) < 0,
            minStockLevel: !formData.minStockLevel || isNaN(formData.minStockLevel) || parseInt(formData.minStockLevel) < 0,
            barcode: !formData.barcode.trim(),
            barcodeDuplicate: false,
        };

        // Check for duplicate barcode (only if barcode is not empty)
        if (!errors.barcode) {
            const existingProduct = products.find(
                (p) => p.barcode === formData.barcode && (!selectedProduct || p.id !== selectedProduct.id)
            );
            errors.barcodeDuplicate = !!existingProduct;
        }

        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    // Handle form submission (Add or Update)
    const handleFormSubmit = () => {
        if (!validateForm()) {
            setSnackbar({
                open: true,
                message: 'Please fill in all required fields correctly.',
                severity: 'error',
            });
            return;
        }

        // Convert string inputs to appropriate types
        const productData = {
            name: formData.name.trim(),
            category: formData.category,
            price: parseFloat(formData.price),
            stockLevel: parseInt(formData.stockLevel),
            minStockLevel: parseInt(formData.minStockLevel),
            barcode: formData.barcode.trim(),
        };

        if (dialogMode === 'add') {
            // Create new product
            const newProduct = {
                id: `p${Date.now()}`,
                ...productData,
            };

            setProducts((prev) => [...prev, newProduct]);

            setSnackbar({
                open: true,
                message: 'Product added successfully!',
                severity: 'success',
            });
        } else if (dialogMode === 'edit' && selectedProduct) {
            // Update existing product
            const updatedProduct = {
                ...selectedProduct,
                ...productData,
            };

            setProducts((prev) =>
                prev.map((product) => (product.id === selectedProduct.id ? updatedProduct : product))
            );

            setSnackbar({
                open: true,
                message: 'Product updated successfully!',
                severity: 'success',
            });
        }

        // Close dialog after successful operation
        setDialogOpen(false);
    };

    // Handle delete product
    const handleDeleteClick = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts((prev) => prev.filter((product) => product.id !== productId));

            setSnackbar({
                open: true,
                message: 'Product deleted successfully!',
                severity: 'success',
            });
        }
    };

    // Close snackbar
    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ p: 4, background: '#f1f5f9', minHeight: '100vh' }}>
            <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Product Stock Management
                </Typography>

                {/* Search Bar */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search products by name or category..."
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

                {/* Add Product Button */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        sx={{ mb: 2 }}
                    >
                        Add New Product
                    </Button>
                </Box>

                {/* Products Table */}
                <Card sx={{ mb: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Product Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Category
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Price
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Stock Level
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Min Stock
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Barcode / SKU
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
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <TableRow
                                            key={product.id}
                                            hover
                                            sx={{
                                                backgroundColor: isLowStock(product) ? '#fff3f3' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: isLowStock(product) ? '#ffe9e9' : 'action.hover',
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                <Typography>{product.name}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{product.category}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>${product.price.toFixed(2)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        color: isLowStock(product) ? 'error.main' : 'inherit',
                                                        fontWeight: isLowStock(product) ? 'bold' : 'normal',
                                                    }}
                                                >
                                                    {product.stockLevel}
                                                    {isLowStock(product) && (
                                                        <WarningIcon
                                                            sx={{
                                                                ml: 1,
                                                                fontSize: 'small',
                                                                color: 'error.main',
                                                                verticalAlign: 'middle',
                                                            }}
                                                        />
                                                    )}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{product.minStockLevel}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    {product.barcode}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEditClick(product)}
                                                    aria-label="edit"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteClick(product.id)}
                                                    aria-label="delete"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                                                No products found. Add a new product to get started.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Add/Edit Product Dialog */}
                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {dialogMode === 'add' ? 'Add New Product' : 'Edit Product'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={formErrors.name}
                                helperText={formErrors.name ? 'Product name is required' : ''}
                                margin="normal"
                                required
                            />

                            <TextField
                                select
                                fullWidth
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                error={formErrors.category}
                                helperText={formErrors.category ? 'Category is required' : ''}
                                margin="normal"
                                required
                            >
                                <MenuItem value="">
                                    <em>Select Category</em>
                                </MenuItem>
                                {CATEGORIES.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Price ($)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                error={formErrors.price}
                                helperText={formErrors.price ? 'Valid price is required (must be > 0)' : ''}
                                margin="normal"
                                required
                                inputProps={{ min: "0.01", step: "0.01" }}
                            />

                            <TextField
                                fullWidth
                                label="Stock Level"
                                name="stockLevel"
                                type="number"
                                value={formData.stockLevel}
                                onChange={handleInputChange}
                                error={formErrors.stockLevel}
                                helperText={formErrors.stockLevel ? 'Valid stock level is required (must be >= 0)' : ''}
                                margin="normal"
                                required
                                inputProps={{ min: "0", step: "1" }}
                            />

                            <TextField
                                fullWidth
                                label="Minimum Stock Level"
                                name="minStockLevel"
                                type="number"
                                value={formData.minStockLevel}
                                onChange={handleInputChange}
                                error={formErrors.minStockLevel}
                                helperText={formErrors.minStockLevel ? 'Valid minimum stock level is required (must be >= 0)' : ''}
                                margin="normal"
                                required
                                inputProps={{ min: "0", step: "1" }}
                            />

                            <TextField
                                fullWidth
                                label="Barcode / SKU"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleInputChange}
                                error={formErrors.barcode || formErrors.barcodeDuplicate}
                                helperText={
                                    formErrors.barcode
                                        ? 'Barcode/SKU is required'
                                        : formErrors.barcodeDuplicate
                                            ? 'This Barcode/SKU already exists'
                                            : ''
                                }
                                margin="normal"
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleFormSubmit} variant="contained" color="primary">
                            {dialogMode === 'add' ? 'Add Product' : 'Update Product'}
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

export default ProductStockManagementPage;