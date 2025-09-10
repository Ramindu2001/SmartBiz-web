import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Paper,
    Divider,
} from '@mui/material';
import {
    AttachMoney as SalesIcon,
    TrendingUp as ProfitIcon,
    Receipt as ExpenseIcon,
    Inventory as InventoryIcon,
    People as CustomerIcon,
    Business as SupplierIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardOverviewPage = () => {
    // Dummy data
    const dashboardData = {
        totalSales: 25000,
        totalProfits: 8500,
        totalExpenses: 16500,
        inventory: [
            { id: 1, name: 'Product A', stock: 25, category: 'Electronics', minStock: 10 },
            { id: 2, name: 'Product B', stock: 8, category: 'Accessories', minStock: 10 },
            { id: 3, name: 'Product C', stock: 42, category: 'Furniture', minStock: 10 },
            { id: 4, name: 'Product D', stock: 3, category: 'Stationery', minStock: 10 },
            { id: 5, name: 'Product E', stock: 15, category: 'Apparel', minStock: 10 },
            { id: 6, name: 'Product F', stock: 12, category: 'Tools', minStock: 10 },
            { id: 7, name: 'Product G', stock: 7, category: 'Toys', minStock: 10 },
            { id: 8, name: 'Product H', stock: 31, category: 'Books', minStock: 10 },
            { id: 9, name: 'Product I', stock: 25, category: 'Electronics', minStock: 10 },
            { id: 10, name: 'Product J', stock: 8, category: 'Accessories', minStock: 10 },
            { id: 11, name: 'Product K', stock: 25, category: 'Electronics', minStock: 10 },
            { id: 12, name: 'Product L', stock: 8, category: 'Accessories', minStock: 10 },
            { id: 13, name: 'Product M', stock: 42, category: 'Furniture', minStock: 10 },
            { id: 14, name: 'Product N', stock: 3, category: 'Stationery', minStock: 10 },
            { id: 15, name: 'Product O', stock: 15, category: 'Apparel', minStock: 10 },
            { id: 16, name: 'Product P', stock: 12, category: 'Tools', minStock: 10 },
            { id: 17, name: 'Product Q', stock: 7, category: 'Toys', minStock: 10 },
            { id: 18, name: 'Product R', stock: 31, category: 'Books', minStock: 10 },
            { id: 19, name: 'Product S', stock: 25, category: 'Electronics', minStock: 10 },
            { id: 20, name: 'Product T', stock: 8, category: 'Accessories', minStock: 10 },
        ],
        activeCustomers: 142,
        suppliers: 28,
    };

    // Calculate metrics
    const totalStock = dashboardData.inventory.reduce((sum, item) => sum + item.stock, 0);
    const lowStockItems = dashboardData.inventory.filter(item => item.stock < item.minStock);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Prepare data for charts
    const inventoryChartData = dashboardData.inventory.map(item => ({
        name: item.name,
        stock: item.stock,
        category: item.category,
    }));

    const pieData = [
        { name: 'Low Stock', value: lowStockItems.length, color: '#ef4444' },
        { name: 'Adequate Stock', value: dashboardData.inventory.length - lowStockItems.length, color: '#10b981' },
    ];

    // KPI Metric Card Component
    const MetricCard = ({ title, value, icon, color, subtitle, trend }) => (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" color={color} fontWeight={700} sx={{ mt: 1 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: `${color}10`,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                    }}>
                        {icon}
                    </Box>
                </Box>
                {trend && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'success.main', mr: 1 }} />
                            {trend}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    // Low Stock Item Component
    const LowStockItem = ({ item }) => (
        <ListItem
            key={item.id}
            sx={{
                px: 2,
                py: 1.5,
                borderRadius: 2,
                mb: 1,
                backgroundColor: 'error.lighter',
                '&:last-child': { mb: 0 }
            }}
        >
            <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
                <WarningIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
                primary={
                    <Typography variant="subtitle1" fontWeight={600} color="error.main">
                        {item.name}
                    </Typography>
                }
                secondary={
                    <Typography variant="body2" color="error.dark">
                        Only {item.stock} units left
                    </Typography>
                }
            />
        </ListItem>
    );

    return (
        <Box sx={{ p: 4, background: '#f1f5f9', minHeight: '100vh' }}>

            <Box>
                <Typography
                    variant="h3"
                    component="h1"
                    fontWeight={700}
                    sx={{
                        mb: 4,
                        background: 'linear-gradient(90deg, #1e40af, #3b82f6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Dashboard Overview
                </Typography>

            </Box>

            {/* KPI Metrics Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 3, width: '100%' }}>
                    <Grid item xs={12} sm={4}>
                        <MetricCard
                            title="Total Sales"
                            value={formatCurrency(dashboardData.totalSales)}
                            icon={<SalesIcon fontSize="large" />}
                            color="#10b981"
                            trend="+12.5% from last month"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <MetricCard
                            title="Total Profits"
                            value={formatCurrency(dashboardData.totalProfits)}
                            icon={<ProfitIcon fontSize="large" />}
                            color="#3b82f6"
                            trend="+8.2% from last month"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <MetricCard
                            title="Total Expenses"
                            value={formatCurrency(dashboardData.totalExpenses)}
                            icon={<ExpenseIcon fontSize="large" />}
                            color="#ef4444"
                            trend="+5.1% from last month"
                        />
                    </Grid>
                </Box>
            </Grid>

            {/* Main Content Grid */}
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>

                <Grid container spacing={3}>
                    {/* Customer & Supplier Summary */}
                    <Grid item xs={12}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                p: 3,
                                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                                height: '75%',
                            }}
                        >
                            <Typography variant="h5" fontWeight={600} sx={{ mb: 3, color: '#0c4a6e' }}>
                                Business Summary
                            </Typography>

                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 4,
                                            borderRadius: 3,
                                            textAlign: 'center',
                                            background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                                            border: '1px solid #93c5fd',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CustomerIcon sx={{ fontSize: 48, color: '#1d4ed8', mb: 2 }} />
                                        <Typography variant="h6" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                                            Active Customers
                                        </Typography>
                                        <Typography variant="h2" fontWeight={700} color="#1d4ed8" sx={{ mb: 2 }}>
                                            {dashboardData.activeCustomers}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            +15% growth this month
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 4,
                                            borderRadius: 3,
                                            textAlign: 'center',
                                            background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                                            border: '1px solid #c4b5fd',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <SupplierIcon sx={{ fontSize: 48, color: '#7c3aed', mb: 2 }} />
                                        <Typography variant="h6" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                                            Suppliers
                                        </Typography>
                                        <Typography variant="h2" fontWeight={700} color="#7c3aed" sx={{ mb: 2 }}>
                                            {dashboardData.suppliers}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            3 new this quarter
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}> */}
                    {/* Low Stock Alerts */}
                    <Grid item xs={12} lg={4}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                height: '100%',
                            }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <WarningIcon sx={{ color: '#ef4444', mr: 2, fontSize: 28 }} />
                                    <Typography variant="h5" fontWeight={600}>
                                        Low Stock Alerts
                                    </Typography>
                                </Box>

                                {lowStockItems.length > 0 ? (
                                    <Box sx={{
                                        maxHeight: 250,
                                        overflowY: 'auto',
                                        pr: 1,
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: '#f1f5f9',
                                            borderRadius: 3,
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: '#cbd5e1',
                                            borderRadius: 3,
                                        },
                                    }}>
                                        <List disablePadding>
                                            {lowStockItems.map(item => (
                                                <LowStockItem key={item.id} item={item} />
                                            ))}
                                        </List>
                                    </Box>
                                ) : (
                                    <Alert
                                        severity="success"
                                        sx={{
                                            borderRadius: 2,
                                            backgroundColor: 'success.lighter',
                                            '& .MuiAlert-icon': {
                                                color: 'success.main',
                                            }
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight={500}>
                                            All products are sufficiently stocked
                                        </Typography>
                                    </Alert>
                                )}

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'center', height: 150 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: 8,
                                                    border: 'none',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    background: '#ffffff',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444', mr: 1 }} />
                                        <Typography variant="caption">Low Stock ({lowStockItems.length})</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981', mr: 1 }} />
                                        <Typography variant="caption">Adequate ({dashboardData.inventory.length - lowStockItems.length})</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Inventory Visualization Section */}
                    <Grid item xs={12} lg={8}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                height: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ p: 10, pb: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <InventoryIcon sx={{ color: '#6366f1', mr: 2, fontSize: 28 }} />
                                    <Typography variant="h5" fontWeight={600}>
                                        Inventory Overview
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Total stock: {totalStock} items across {dashboardData.inventory.length} products
                                </Typography>
                            </Box>

                            <Box sx={{ p: 3, pt: 0, height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={inventoryChartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                background: '#ffffff',
                                            }}
                                        />
                                        <Bar
                                            dataKey="stock"
                                            fill="#6366f1"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Card>
                    </Grid>
                    {/* </Box> */}

                </Grid>
            </Box>

        </Box>
    );
};

export default DashboardOverviewPage;