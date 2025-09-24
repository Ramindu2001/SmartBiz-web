import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Tab,
    Tabs,
    Typography,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Collapse,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextField,
} from '@mui/material';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { subDays, subWeeks, subMonths, format } from 'date-fns';

// Dummy data
const generateSalesData = () => {
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        data.push({
            date: format(date, 'MM/dd'),
            sales: Math.floor(Math.random() * 5000) + 1000,
            orders: Math.floor(Math.random() * 50) + 5,
        });
    }

    return data;
};

const generateMonthlySalesData = () => {
    const data = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 12; i++) {
        data.push({
            month: monthNames[i],
            sales: Math.floor(Math.random() * 20000) + 5000,
            orders: Math.floor(Math.random() * 200) + 20,
        });
    }

    return data;
};

const productsData = [
    { id: 1, name: 'Premium Wireless Headphones', sales: 345, revenue: 86250 },
    { id: 2, name: 'Smart Fitness Watch', sales: 289, revenue: 57800 },
    { id: 3, name: 'Portable Bluetooth Speaker', sales: 245, revenue: 24500 },
    { id: 4, name: 'Gaming Laptop', sales: 187, revenue: 187000 },
    { id: 5, name: '4K Ultra HD TV', sales: 156, revenue: 156000 },
    { id: 6, name: 'Wireless Charging Pad', sales: 134, revenue: 6700 },
    { id: 7, name: 'Smart Home Hub', sales: 98, revenue: 29400 },
    { id: 8, name: 'Noise Cancelling Earbuds', sales: 87, revenue: 17400 },
];

const customersData = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com',
        totalSpent: 1250.00,
        transactions: [
            { id: 101, date: '2023-11-15', amount: 299.99, items: 2 },
            { id: 102, date: '2023-10-28', amount: 149.99, items: 1 },
            { id: 103, date: '2023-09-12', amount: 800.02, items: 3 },
        ]
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        totalSpent: 895.50,
        transactions: [
            { id: 104, date: '2023-11-10', amount: 199.99, items: 1 },
            { id: 105, date: '2023-10-05', amount: 695.51, items: 2 },
        ]
    },
    {
        id: 3,
        name: 'Michael Brown',
        email: 'm.brown@email.com',
        totalSpent: 2150.75,
        transactions: [
            { id: 106, date: '2023-11-20', amount: 1299.99, items: 1 },
            { id: 107, date: '2023-11-02', amount: 549.99, items: 1 },
            { id: 108, date: '2023-10-15', amount: 300.77, items: 2 },
        ]
    },
    {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        totalSpent: 675.25,
        transactions: [
            { id: 109, date: '2023-11-08', amount: 349.99, items: 1 },
            { id: 110, date: '2023-10-22', amount: 325.26, items: 2 },
        ]
    },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const ReportsAnalyticsPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [dateRange, setDateRange] = useState('daily');
    const [startDate, setStartDate] = useState(subDays(new Date(), 7));
    const [endDate, setEndDate] = useState(new Date());
    const [salesData, setSalesData] = useState(generateSalesData());
    const [monthlySalesData, setMonthlySalesData] = useState(generateMonthlySalesData());
    const [chartType, setChartType] = useState('bar');
    const [exportSnackbar, setExportSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [expandedCustomer, setExpandedCustomer] = useState(null);

    useEffect(() => {
        if (dateRange === 'daily') {
            setSalesData(generateSalesData());
        } else if (dateRange === 'weekly') {
            // Simulate weekly data
            const weeklyData = [];
            for (let i = 4; i >= 0; i--) {
                const weekStart = subWeeks(new Date(), i);
                weeklyData.push({
                    week: `Week ${5 - i}`,
                    sales: Math.floor(Math.random() * 15000) + 5000,
                    orders: Math.floor(Math.random() * 150) + 15,
                });
            }
            setSalesData(weeklyData);
        } else if (dateRange === 'monthly') {
            setSalesData(monthlySalesData);
        } else if (dateRange === 'custom' && startDate && endDate) {
            // Generate custom date range data
            const customData = [];
            const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

            for (let i = 0; i <= Math.min(daysDiff, 30); i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                if (date <= endDate) {
                    customData.push({
                        date: format(date, 'MM/dd'),
                        sales: Math.floor(Math.random() * 5000) + 1000,
                        orders: Math.floor(Math.random() * 50) + 5,
                    });
                }
            }
            setSalesData(customData);
        }
    }, [dateRange, startDate, endDate, monthlySalesData]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleDateRangeChange = (event) => {
        setDateRange(event.target.value);
    };

    const handleExport = (format) => {
        // Simulate export process
        setExportSnackbar({
            open: true,
            message: `Report exported successfully as ${format.toUpperCase()}`,
            severity: 'success'
        });

        // In a real app, you would generate and download the file here
        console.log(`Exporting report as ${format}`);
    };

    const handleSnackbarClose = () => {
        setExportSnackbar({ ...exportSnackbar, open: false });
    };

    const toggleCustomer = (customerId) => {
        setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
    };

    // Chart components
    const renderBarChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey={dateRange === 'monthly' ? 'month' : dateRange === 'weekly' ? 'week' : 'date'}
                    label={{ value: dateRange === 'monthly' ? 'Month' : dateRange === 'weekly' ? 'Week' : 'Date', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis label={{ value: 'Sales ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
            </BarChart>
        </ResponsiveContainer>
    );

    const renderLineChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey={dateRange === 'monthly' ? 'month' : dateRange === 'weekly' ? 'week' : 'date'}
                    label={{ value: dateRange === 'monthly' ? 'Month' : dateRange === 'weekly' ? 'Week' : 'Date', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis label={{ value: 'Sales ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales ($)" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );

    const renderPieChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={productsData.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="sales"
                    nameKey="name"
                >
                    {productsData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} units`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return renderBarChart();
            case 'line':
                return renderLineChart();
            case 'pie':
                return renderPieChart();
            default:
                return renderBarChart();
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Reports & Analytics
            </Typography>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{ mb: 3 }}
                aria-label="report tabs"
            >
                <Tab label="Sales Reports" />
                <Tab label="Analytics" />
            </Tabs>

            {activeTab === 0 && (
                <Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Date Range</InputLabel>
                                <Select
                                    value={dateRange}
                                    label="Date Range"
                                    onChange={handleDateRangeChange}
                                >
                                    <MenuItem value="daily">Daily</MenuItem>
                                    <MenuItem value="weekly">Weekly</MenuItem>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                    <MenuItem value="custom">Custom Range</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {dateRange === 'custom' && (
                            <Grid item xs={12} md={6} container spacing={2}>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Start Date"
                                            value={startDate}
                                            onChange={(newValue) => setStartDate(newValue)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="End Date"
                                            value={endDate}
                                            onChange={(newValue) => setEndDate(newValue)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        )}

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Chart Type</InputLabel>
                                <Select
                                    value={chartType}
                                    label="Chart Type"
                                    onChange={(e) => setChartType(e.target.value)}
                                >
                                    <MenuItem value="bar">Bar Chart</MenuItem>
                                    <MenuItem value="line">Line Chart</MenuItem>
                                    <MenuItem value="pie">Pie Chart</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title="Sales Overview"
                                    action={
                                        <Box>
                                            <Button
                                                variant="outlined"
                                                sx={{ mr: 1 }}
                                                onClick={() => handleExport('excel')}
                                            >
                                                Export to Excel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleExport('pdf')}
                                            >
                                                Export to PDF
                                            </Button>
                                        </Box>
                                    }
                                />
                                <CardContent>
                                    {renderChart()}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {activeTab === 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader
                                title="Best-Selling Products"
                                action={
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleExport('excel')}
                                    >
                                        Export
                                    </Button>
                                }
                            />
                            <CardContent>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Rank</TableCell>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="right">Units Sold</TableCell>
                                            <TableCell align="right">Revenue</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productsData.map((product, index) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell align="right">{product.sales.toLocaleString()}</TableCell>
                                                <TableCell align="right">${product.revenue.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader
                                title="Customer Purchase History"
                                action={
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleExport('pdf')}
                                    >
                                        Export
                                    </Button>
                                }
                            />
                            <CardContent>
                                <List>
                                    {customersData.map((customer) => (
                                        <React.Fragment key={customer.id}>
                                            <ListItem
                                                button
                                                onClick={() => toggleCustomer(customer.id)}
                                                sx={{
                                                    bgcolor: expandedCustomer === customer.id ? 'action.hover' : 'inherit',
                                                    borderRadius: 1,
                                                    mb: 1
                                                }}
                                            >
                                                <ListItemText
                                                    primary={customer.name}
                                                    secondary={`${customer.email} • Total: $${customer.totalSpent.toLocaleString()}`}
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    {customer.transactions.length} transactions
                                                </Typography>
                                            </ListItem>

                                            <Collapse in={expandedCustomer === customer.id} timeout="auto" unmountOnExit>
                                                <Paper sx={{ mx: 2, mb: 2, p: 2 }} elevation={0} variant="outlined">
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Recent Transactions
                                                    </Typography>
                                                    {customer.transactions.map((transaction) => (
                                                        <Box key={transaction.id} sx={{ mb: 1, pb: 1 }}>
                                                            <Typography variant="body2">
                                                                <strong>Date:</strong> {transaction.date}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>Items:</strong> {transaction.items}
                                                            </Typography>
                                                            <Divider />
                                                        </Box>
                                                    ))}
                                                </Paper>
                                            </Collapse>
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Snackbar
                open={exportSnackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={exportSnackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {exportSnackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReportsAnalyticsPage;