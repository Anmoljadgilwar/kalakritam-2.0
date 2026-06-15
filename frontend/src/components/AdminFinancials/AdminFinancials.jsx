import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import AdminLoading from '../AdminLoading';
import { eventsApi, financialsApi } from '../../lib/adminApi';
import { toast } from '../../utils/notifications';
import '../AdminGallery/AdminGallery.css';
import './AdminFinancials.css';

const palette = {
  gold: '#c38f21',
  goldLight: '#d4af85',
  dark: '#002f2f',
  darkCard: '#073838',
  white: '#ffffff',
  text: '#e0e0e0'
};

const numberOrZero = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;

const AdminFinancials = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [records, setRecords] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [ticketDist, setTicketDist] = useState([]);
  const [form, setForm] = useState({
    id: null,
    eventId: '',
    eventDate: '',
    ticketSold: '',
    income: '',
    eventExpense: '',
    materialCost: '',
    marketingCost: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ year: new Date().getFullYear(), month: '' });

  // Access control: redirect if no admin token
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [eventsRes, listRes, monthlyRes, yearlyRes, analyticsRes] = await Promise.all([
          eventsApi.getAll({ page: 1, limit: 1000 }),
          financialsApi.list({ page: 1, limit: 500, year: filters.year, month: filters.month || undefined }),
          financialsApi.monthlySummary(filters.year),
          financialsApi.yearlySummary(),
          financialsApi.analytics()
        ]);
        setEvents(eventsRes.success ? (eventsRes.data || []) : []);
        setRecords(listRes.success ? (listRes.data || []) : []);
        setMonthly(monthlyRes.success ? (monthlyRes.data || []) : []);
        setYearly(yearlyRes.success ? (yearlyRes.data || []) : []);
        if (analyticsRes.success) {
          setTicketDist(analyticsRes.data?.ticketDistribution || []);
        }
      } catch (e) {
        console.error(e);
        toast.error('Failed to load financial analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters.year, filters.month]);

  const selectedEvent = useMemo(
    () => events.find((e) => String(e.id) === String(form.eventId)),
    [events, form.eventId]
  );

  useEffect(() => {
    if (selectedEvent) {
      const dt = selectedEvent.startDate || selectedEvent.start_date;
      setForm((f) => ({ ...f, eventDate: dt || '' }));
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const refreshData = async () => {
    try {
      const [listRes, monthlyRes, yearlyRes, analyticsRes] = await Promise.all([
        financialsApi.list({ page: 1, limit: 500, year: filters.year, month: filters.month || undefined }),
        financialsApi.monthlySummary(filters.year),
        financialsApi.yearlySummary(),
        financialsApi.analytics()
      ]);
      setRecords(listRes.success ? (listRes.data || []) : []);
      setMonthly(monthlyRes.success ? (monthlyRes.data || []) : []);
      setYearly(yearlyRes.success ? (yearlyRes.data || []) : []);
      if (analyticsRes.success) setTicketDist(analyticsRes.data?.ticketDistribution || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!form.eventId) return toast.warning('Select an event');
    const payload = {
      event_id: form.eventId,
      ticket_sold: numberOrZero(form.ticketSold),
      income: numberOrZero(form.income),
      event_expense: numberOrZero(form.eventExpense),
      material_cost: numberOrZero(form.materialCost),
      marketing_cost: numberOrZero(form.marketingCost)
    };
    try {
      const res = isEditing 
        ? await financialsApi.update(form.id, payload)
        : await financialsApi.create(payload);
      
      if (res.success) {
        toast.success(isEditing ? 'Financial record updated' : 'Financial record created');
        await refreshData();
        handleCancel();
      } else {
        toast.error(res.message || 'Failed to save');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save');
    }
  };

  const handleEdit = (record) => {
    setForm({
      id: record.id,
      eventId: record.event_id,
      eventDate: record.event_date || '',
      ticketSold: record.ticket_sold || '',
      income: record.income || '',
      eventExpense: record.event_expense || '',
      materialCost: record.material_cost || '',
      marketingCost: record.marketing_cost || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this financial record?')) return;
    try {
      const res = await financialsApi.remove(id);
      if (res.success) {
        toast.success('Financial record deleted');
        await refreshData();
      } else {
        toast.error(res.message || 'Failed to delete');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete');
    }
  };

  const handleCancel = () => {
    setForm({ id: null, eventId: '', eventDate: '', ticketSold: '', income: '', eventExpense: '', materialCost: '', marketingCost: '' });
    setIsEditing(false);
  };

  const eventProfitRows = useMemo(() =>
    records.map(r => ({
      id: r.id,
      eventName: r.event_name,
      eventDate: r.event_date,
      profit: Number(r.total_profit),
      income: Number(r.income),
      investment: Number(r.total_investment),
      tickets: Number(r.ticket_sold)
    })), [records]
  );

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const dateA = new Date(a.event_date || a.created_at || 0);
      const dateB = new Date(b.event_date || b.created_at || 0);
      return dateA - dateB;
    });
  }, [records]);

  const eventChartData = useMemo(() => {
    if (!sortedRecords || sortedRecords.length === 0) {
      return {
        labels: [],
        income: [],
        investment: [],
        profit: [],
        dates: []
      };
    }
    return {
      labels: sortedRecords.map(r => {
        const evt = events.find(e => e.id === r.event_id);
        return evt?.title || 'Event';
      }),
      income: sortedRecords.map(r => parseFloat(r.income) || 0),
      investment: sortedRecords.map(r => {
        const eventExp = parseFloat(r.event_expense) || 0;
        const materialCost = parseFloat(r.material_cost) || 0;
        const marketingCost = parseFloat(r.marketing_cost) || 0;
        return eventExp + materialCost + marketingCost;
      }),
      profit: sortedRecords.map(r => {
        const income = parseFloat(r.income) || 0;
        const eventExp = parseFloat(r.event_expense) || 0;
        const materialCost = parseFloat(r.material_cost) || 0;
        const marketingCost = parseFloat(r.marketing_cost) || 0;
        return income - (eventExp + materialCost + marketingCost);
      }),
      dates: sortedRecords.map(r => r.event_date)
    };
  }, [sortedRecords, events]);

  const barChartData = useMemo(() => {
    const data = eventProfitRows.map(r => r.profit);
    const labels = eventProfitRows.map(r => r.eventName || `Event ${r.id}`);
    return { data, labels };
  }, [eventProfitRows]);

  const lineChartData = useMemo(() => {
    const months = (monthly || []).map(m => m.month);
    const profits = (monthly || []).map(m => Number(m.total_profit));
    return { months, profits };
  }, [monthly]);

  const pieData = useMemo(() => {
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];
    return (ticketDist || []).map((t, idx) => ({
      id: idx,
      value: Number(t.tickets),
      label: t.eventName || `Event ${t.eventId}`,
      color: colors[idx % colors.length]
    }));
  }, [ticketDist]);

  const budgetChartData = useMemo(() => ({
    labels: eventProfitRows.map(r => r.eventName || `Event ${r.id}`),
    income: eventProfitRows.map(r => r.income),
    investment: eventProfitRows.map(r => r.investment)
  }), [eventProfitRows]);

  if (loading) return <AdminLoading message="Loading Financial Analytics..." />;

  return (
    <div className="admin-gallery-container admin-financials-container" style={{ background: palette.dark, color: palette.white, minHeight: '100vh' }}>
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          <linearGradient id="chart-gold-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c38f21" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#c38f21" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="chart-teal-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00a3a3" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#002f2f" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="chart-teal-gold-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c38f21" stopOpacity={0.5} />
            <stop offset="50%" stopColor="#002f2f" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#001818" stopOpacity={0.0} />
          </linearGradient>
        </defs>
      </svg>
      <VideoLogo />
      <AdminHeader currentPage="financials" />
      <main className="admin-gallery-content" style={{ padding: '2rem' }}>
        <section className="admin-gallery-header" style={{ marginBottom: '2rem' }}>
          <div className="header-content">
            <h1 className="admin-gallery-title" style={{ color: palette.gold, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Financial Analytics Dashboard</h1>
            <p className="admin-gallery-subtitle" style={{ color: palette.text, fontSize: '1.1rem' }}>Track event profits, budgets, and revenue with real-time analytics</p>
          </div>
        </section>

        {/* Event Profit Sparklines */}
        <Card sx={{ 
          background: `linear-gradient(135deg, ${palette.darkCard} 0%, ${palette.dark} 100%)`, 
          color: palette.white, 
          border: `2px solid ${palette.gold}`,
          borderRadius: '12px',
          boxShadow: `0 4px 20px rgba(195, 143, 33, 0.2)`,
          mb: 3
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: palette.gold, mb: 3, fontWeight: 600 }}>
              ⚡ Event Profit Overview (By Date)
            </Typography>
            {!sortedRecords || sortedRecords.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: palette.text }}>
                <Typography>No event data available. Add financial records to see profit trends.</Typography>
              </Box>
            ) : (
              <>
                <Stack
                  width="100%"
                  direction={{ xs: 'column', md: 'row' }}
                  gap={3}
                >
                  <Box flexGrow={1}>
                    <Typography variant="body2" sx={{ color: palette.goldLight, mb: 1, textAlign: 'center' }}>
                      Profit Trend (Line)
                    </Typography>
                    <LineChart
                      className="glowing-line-chart"
                      xAxis={[{ 
                        data: sortedRecords.map((_, idx) => idx + 1),
                        scaleType: 'linear',
                        tickLabelStyle: { fill: palette.text, fontSize: 10 }
                      }]}
                      series={[{
                        data: sortedRecords.map(r => {
                          const income = parseFloat(r.income) || 0;
                          const eventExp = parseFloat(r.event_expense) || 0;
                          const materialCost = parseFloat(r.material_cost) || 0;
                          const marketingCost = parseFloat(r.marketing_cost) || 0;
                          return income - (eventExp + materialCost + marketingCost);
                        }),
                        color: palette.gold,
                        curve: 'catmullRom',
                        area: true
                      }]}
                      height={120}
                      margin={{ top: 10, right: 10, bottom: 20, left: 40 }}
                      sx={{
                        '& .MuiChartsAxis-line': { stroke: palette.goldLight },
                        '& .MuiChartsAxis-tick': { stroke: palette.goldLight },
                        '& .MuiChartsAxis-tickLabel': { fill: palette.text },
                        '& .MuiAreaElement-root': {
                          fill: 'url(#chart-gold-gradient)',
                          opacity: 0.3
                        }
                      }}
                    />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography variant="body2" sx={{ color: palette.goldLight, mb: 1, textAlign: 'center' }}>
                      Profit Trend (Bar)
                    </Typography>
                    <BarChart
                      className="glowing-bar-chart"
                      xAxis={[{ 
                        data: sortedRecords.map((_, idx) => idx + 1),
                        scaleType: 'band'
                      }]}
                      series={[{
                        data: sortedRecords.map(r => {
                          const income = parseFloat(r.income) || 0;
                          const eventExp = parseFloat(r.event_expense) || 0;
                          const materialCost = parseFloat(r.material_cost) || 0;
                          const marketingCost = parseFloat(r.marketing_cost) || 0;
                          return income - (eventExp + materialCost + marketingCost);
                        }),
                        color: '#00a3a3'
                      }]}
                      height={120}
                      margin={{ top: 10, right: 10, bottom: 20, left: 40 }}
                      sx={{
                        '& .MuiChartsAxis-line': { stroke: palette.goldLight },
                        '& .MuiChartsAxis-tick': { stroke: palette.goldLight },
                        '& .MuiChartsAxis-tickLabel': { fill: palette.text }
                      }}
                    />
                  </Box>
                </Stack>
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  {sortedRecords.map((r, idx) => {
                    const evt = events.find(e => e.id === r.event_id);
                    const dateStr = r.event_date 
                      ? new Date(r.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : 'No Date';
                    return (
                      <Typography 
                        key={idx} 
                        variant="caption" 
                        sx={{ 
                          color: palette.text, 
                          fontSize: '10px',
                          px: 1,
                          py: 0.5,
                          bgcolor: palette.dark,
                          borderRadius: '4px',
                          border: `1px solid ${palette.goldLight}`
                        }}
                      >
                        {idx + 1}. {evt?.title || 'Event'} - {dateStr}
                      </Typography>
                    );
                  })}
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        {/* Create/Update Form */}
        <Card sx={{ mt: 3, background: palette.darkCard, color: palette.white, border: `2px solid ${palette.gold}`, borderRadius: '12px' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: palette.gold, mb: 2, fontWeight: 600 }}>
              {isEditing ? '✏️ Edit Financial Record' : '➕ Add New Financial Record'}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="event-label" sx={{ color: palette.goldLight }}>Event *</InputLabel>
                  <Select
                    labelId="event-label"
                    name="eventId"
                    value={form.eventId}
                    label="Event"
                    onChange={handleChange}
                    sx={{ 
                      color: palette.white,
                      '.MuiOutlinedInput-notchedOutline': { borderColor: palette.goldLight },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: palette.gold },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.gold }
                    }}
                  >
                    {events.map(e => (
                      <MenuItem key={e.id} value={e.id}>{e.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  fullWidth 
                  label="Event Date" 
                  value={form.eventDate ? new Date(form.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Auto-populated from event'} 
                  InputProps={{ readOnly: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: palette.text,
                      '& fieldset': { borderColor: palette.goldLight },
                      '&:hover fieldset': { borderColor: palette.gold }
                    },
                    '& .MuiInputLabel-root': { color: palette.goldLight }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField 
                  fullWidth 
                  name="ticketSold" 
                  label="Tickets Sold" 
                  type="number" 
                  value={form.ticketSold} 
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: palette.white,
                      '& fieldset': { borderColor: palette.goldLight },
                      '&:hover fieldset': { borderColor: palette.gold },
                      '&.Mui-focused fieldset': { borderColor: palette.gold }
                    },
                    '& .MuiInputLabel-root': { color: palette.goldLight }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField 
                  fullWidth 
                  name="income" 
                  label="Income (₹)" 
                  type="number" 
                  value={form.income} 
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: palette.white,
                      '& fieldset': { borderColor: palette.goldLight },
                      '&:hover fieldset': { borderColor: palette.gold },
                      '&.Mui-focused fieldset': { borderColor: palette.gold }
                    },
                    '& .MuiInputLabel-root': { color: palette.goldLight }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField 
                  fullWidth 
                  name="eventExpense" 
                  label="Event Expense (₹)" 
                  type="number" 
                  value={form.eventExpense} 
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: palette.white,
                      '& fieldset': { borderColor: palette.goldLight },
                      '&:hover fieldset': { borderColor: palette.gold },
                      '&.Mui-focused fieldset': { borderColor: palette.gold }
                    },
                    '& .MuiInputLabel-root': { color: palette.goldLight }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField 
                  fullWidth 
                  name="materialCost" 
                  label="Material Cost (₹)" 
                  type="number" 
                  value={form.materialCost} 
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: palette.white,
                      '& fieldset': { borderColor: palette.goldLight },
                      '&:hover fieldset': { borderColor: palette.gold },
                      '&.Mui-focused fieldset': { borderColor: palette.gold }
                    },
                    '& .MuiInputLabel-root': { color: palette.goldLight }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField 
                  fullWidth 
                  name="marketingCost" 
                  label="Marketing Cost (₹)" 
                  type="number" 
                  value={form.marketingCost} 
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: palette.white,
                      '& fieldset': { borderColor: palette.goldLight },
                      '&:hover fieldset': { borderColor: palette.gold },
                      '&.Mui-focused fieldset': { borderColor: palette.gold }
                    },
                    '& .MuiInputLabel-root': { color: palette.goldLight }
                  }}
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button 
                variant="contained" 
                onClick={handleSave}
                sx={{ 
                  background: `linear-gradient(135deg, ${palette.gold} 0%, ${palette.goldLight} 100%)`,
                  color: '#000',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { background: palette.gold }
                }}
              >
                {isEditing ? 'Update Record' : 'Save Record'}
              </Button>
              {isEditing && (
                <Button 
                  variant="outlined" 
                  onClick={handleCancel}
                  sx={{ 
                    borderColor: palette.goldLight,
                    color: palette.goldLight,
                    fontWeight: 600,
                    px: 4,
                    '&:hover': { borderColor: palette.gold, color: palette.gold }
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Financial Records Table */}
        <Card sx={{ mt: 3, background: palette.darkCard, color: palette.white, border: `2px solid ${palette.gold}`, borderRadius: '12px' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: palette.gold, mb: 2, fontWeight: 600 }}>💰 Financial Records</Typography>
            <TableContainer component={Paper} sx={{ background: palette.dark, borderRadius: '8px' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: palette.darkCard }}>
                    <TableCell sx={{ color: palette.gold, fontWeight: 700, borderBottom: `2px solid ${palette.gold}` }}>Event</TableCell>
                    <TableCell sx={{ color: palette.gold, fontWeight: 700, borderBottom: `2px solid ${palette.gold}` }}>Date</TableCell>
                    <TableCell sx={{ color: palette.gold, fontWeight: 700, borderBottom: `2px solid ${palette.gold}`, textAlign: 'right' }}>Tickets</TableCell>
                    <TableCell sx={{ color: palette.gold, fontWeight: 700, borderBottom: `2px solid ${palette.gold}`, textAlign: 'right' }}>Income</TableCell>
                    <TableCell sx={{ color: palette.gold, fontWeight: 700, borderBottom: `2px solid ${palette.gold}`, textAlign: 'right' }}>Investment</TableCell>
                    <TableCell sx={{ color: palette.gold, fontWeight: 700, borderBottom: `2px solid ${palette.gold}`, textAlign: 'right' }}>Profit</TableCell>
                    <TableCell sx={{ color: palette.gold, fontWeight: 700, borderBottom: `2px solid ${palette.gold}`, textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventProfitRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ color: palette.text, textAlign: 'center', py: 4, borderBottom: `1px solid ${palette.darkCard}` }}>
                        No financial records found. Add one above to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    eventProfitRows.map((row) => (
                      <TableRow key={row.id} sx={{ '&:hover': { background: palette.darkCard } }}>
                        <TableCell sx={{ color: palette.white, borderBottom: `1px solid ${palette.darkCard}` }}>{row.eventName || 'Unknown Event'}</TableCell>
                        <TableCell sx={{ color: palette.text, borderBottom: `1px solid ${palette.darkCard}` }}>
                          {row.eventDate ? new Date(row.eventDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: palette.white, borderBottom: `1px solid ${palette.darkCard}`, textAlign: 'right' }}>{row.tickets}</TableCell>
                        <TableCell sx={{ color: palette.white, borderBottom: `1px solid ${palette.darkCard}`, textAlign: 'right' }}>₹{row.income.toLocaleString()}</TableCell>
                        <TableCell sx={{ color: palette.white, borderBottom: `1px solid ${palette.darkCard}`, textAlign: 'right' }}>₹{row.investment.toLocaleString()}</TableCell>
                        <TableCell sx={{ 
                          color: row.profit >= 0 ? '#4ade80' : '#f87171', 
                          borderBottom: `1px solid ${palette.darkCard}`, 
                          textAlign: 'right',
                          fontWeight: 600
                        }}>
                          ₹{row.profit.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${palette.darkCard}`, textAlign: 'center' }}>
                          <IconButton 
                            onClick={() => handleEdit(records.find(r => r.id === row.id))}
                            sx={{ color: palette.goldLight, '&:hover': { color: palette.gold } }}
                            title="Edit"
                          >
                            ✏️
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(row.id)}
                            sx={{ color: '#f87171', '&:hover': { color: '#ef4444' } }}
                            title="Delete"
                          >
                            🗑️
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Monthly Profit Chart */}
        <Typography variant="h5" sx={{ color: palette.gold, mt: 4, mb: 3, fontWeight: 700 }}>
          📈 Monthly Profit Trend ({filters.year})
        </Typography>
        <Card sx={{ 
          background: `linear-gradient(135deg, ${palette.darkCard} 0%, ${palette.dark} 100%)`, 
          color: palette.white, 
          border: `2px solid ${palette.gold}`,
          borderRadius: '12px',
          boxShadow: `0 4px 20px rgba(195, 143, 33, 0.2)`
        }}>
          <CardContent sx={{ p: 4 }}>
            {monthly.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, color: palette.text }}>
                <Typography>No monthly data available for {filters.year}.</Typography>
              </Box>
            ) : (
              <LineChart
                className="glowing-line-chart"
                xAxis={[{ 
                  data: monthly.map(m => {
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return monthNames[m.month - 1] || m.month;
                  }),
                  scaleType: 'band',
                  label: 'Month',
                  tickLabelStyle: { fill: palette.text, fontSize: 12 },
                  labelStyle: { fill: palette.goldLight, fontSize: 14 }
                }]}
                series={[
                  {
                    data: monthly.map(m => parseFloat(m.total_profit) || 0),
                    label: 'Profit (₹)',
                    color: palette.gold,
                    curve: 'catmullRom',
                    showMark: true,
                    area: true
                  }
                ]}
                height={400}
                margin={{ top: 20, right: 30, bottom: 60, left: 80 }}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                  '& .MuiChartsAxis-line': { stroke: palette.goldLight },
                  '& .MuiChartsAxis-tick': { stroke: palette.goldLight },
                  '& .MuiChartsAxis-tickLabel': { fill: palette.text },
                  '& .MuiChartsLegend-series text': { fill: `${palette.text} !important` },
                  '& .MuiAreaElement-root': {
                    fill: 'url(#chart-teal-gold-gradient)',
                    opacity: 0.45
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Event-wise Financial Comparison */}
        <Typography variant="h5" sx={{ color: palette.gold, mt: 4, mb: 3, fontWeight: 700 }}>
          📊 Event-wise Financial Breakdown (By Date)
        </Typography>
        <Card sx={{ 
          background: `linear-gradient(135deg, ${palette.darkCard} 0%, ${palette.dark} 100%)`, 
          color: palette.white, 
          border: `2px solid ${palette.gold}`,
          borderRadius: '12px',
          boxShadow: `0 4px 20px rgba(195, 143, 33, 0.2)`
        }}>
          <CardContent sx={{ p: 4 }}>
            {records.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, color: palette.text }}>
                <Typography>No event financial data available. Add records to see the chart.</Typography>
              </Box>
            ) : (
              <>
                <Typography variant="body2" sx={{ color: palette.goldLight, mb: 2 }}>
                  Showing {eventChartData.labels.length} event(s)
                </Typography>
                <BarChart
                  className="glowing-bar-chart"
                  xAxis={[{ 
                    data: eventChartData.labels,
                    scaleType: 'band',
                    tickLabelStyle: { fill: palette.text, fontSize: 10, angle: -45, textAnchor: 'end' }
                  }]}
                  grid={{ horizontal: true }}
                  slotProps={{
                    legend: {
                      direction: 'horizontal',
                      position: { vertical: 'top', horizontal: 'center' },
                      padding: 0
                    }
                  }}
                  series={[
                    { 
                      data: eventChartData.income,
                      label: 'Income (₹)',
                      color: '#00a3a3',
                      valueFormatter: (value, { dataIndex }) => {
                        const date = eventChartData.dates[dataIndex] 
                          ? new Date(eventChartData.dates[dataIndex]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                          : 'No Date';
                        return `₹${value.toLocaleString()} - ${date}`;
                      }
                    },
                    { 
                      data: eventChartData.investment,
                      label: 'Investment (₹)',
                      color: palette.goldLight,
                      valueFormatter: (value, { dataIndex }) => {
                        const date = eventChartData.dates[dataIndex] 
                          ? new Date(eventChartData.dates[dataIndex]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                          : 'No Date';
                        return `₹${value.toLocaleString()} - ${date}`;
                      }
                    },
                    { 
                      data: eventChartData.profit,
                      label: 'Profit (₹)',
                      color: palette.gold,
                      valueFormatter: (value, { dataIndex }) => {
                        const date = eventChartData.dates[dataIndex] 
                          ? new Date(eventChartData.dates[dataIndex]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                          : 'No Date';
                        return `₹${value.toLocaleString()} - ${date}`;
                      }
                    }
                  ]}
                  height={400}
                  margin={{ top: 20, right: 30, bottom: 100, left: 80 }}
                  sx={{
                    '& .MuiChartsAxis-line': { stroke: palette.goldLight },
                    '& .MuiChartsAxis-tick': { stroke: palette.goldLight },
                    '& .MuiChartsAxis-tickLabel': { fill: palette.text },
                    '& .MuiChartsLegend-series text': { fill: `${palette.text} !important` }
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminFinancials;
