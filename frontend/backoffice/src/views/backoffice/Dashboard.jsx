import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import MainCard from 'ui-component/cards/MainCard';

import { IconBuildingStore, IconCreditCard, IconPackage, IconUsers } from '@tabler/icons-react';
import { apiGet } from 'services/api';

const money = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'BIF',
  maximumFractionDigits: 0
});

function rows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function statusColor(status) {
  if (['payee', 'reussi', 'validee', 'cloturee'].includes(status)) return 'success';
  if (['en_attente', 'en_attente_paiement', 'initie', 'demande'].includes(status)) return 'warning';
  if (['annulee', 'echoue', 'refusee', 'suspendue'].includes(status)) return 'error';
  return 'default';
}

function StatCard({ title, value, caption, icon: Icon, color = 'primary' }) {
  return (
    <MainCard>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h2" sx={{ mt: 1 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.dark`, width: 48, height: 48 }}>
          <Icon size={24} />
        </Avatar>
      </Stack>
    </MainCard>
  );
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || 'non_defini';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function ChartCard({ title, type = 'donut', labels, series, colors }) {
  const values = type === 'bar' ? series.flatMap((item) => item.data || []) : series;
  const hasData = values.some((value) => value > 0);

  return (
    <MainCard title={title}>
      {hasData ? (
        <Chart
          type={type}
          height={300}
          series={series}
          options={{
            chart: { toolbar: { show: false }, fontFamily: 'inherit' },
            labels,
            colors,
            legend: { position: 'bottom' },
            dataLabels: { enabled: true },
            stroke: { width: type === 'donut' ? 2 : 0 },
            plotOptions: {
              bar: {
                borderRadius: 4,
                columnWidth: '45%'
              }
            },
            xaxis: type === 'bar' ? { categories: labels } : undefined,
            yaxis: type === 'bar' ? { min: 0, forceNiceScale: true } : undefined
          }}
        />
      ) : (
        <Box sx={{ display: 'grid', minHeight: 300, placeItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Aucune donnee a afficher
          </Typography>
        </Box>
      )}
    </MainCard>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({
    users: [],
    shops: [],
    products: [],
    orders: [],
    payments: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.all([
      apiGet('/users/users/'),
      apiGet('/users/boutiques/'),
      apiGet('/catalog/products/'),
      apiGet('/orders/orders/'),
      apiGet('/payments/payments/'),
      apiGet('/catalog/categories/')
    ])
      .then(([users, shops, products, orders, payments, categories]) => {
        if (!mounted) return;
        setData({
          users: rows(users),
          shops: rows(shops),
          products: rows(products),
          orders: rows(orders),
          payments: rows(payments),
          categories: rows(categories)
        });
      })
      .catch(() => {
        if (mounted) setError("Impossible de charger les indicateurs. Connectez-vous avec un compte administrateur.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const clients = data.users.filter((user) => user.role === 'client').length;
    const vendors = data.users.filter((user) => user.role === 'vendeur').length;
    const admins = data.users.filter((user) => user.role === 'admin').length;
    const paidPayments = data.payments.filter((payment) => payment.statut === 'reussi');
    const revenue = paidPayments.reduce((sum, payment) => sum + Number(payment.montant || 0), 0);
    const pendingShops = data.shops.filter((shop) => shop.statut === 'en_attente');
    const lowStock = data.products.filter((product) => Number(product.stock || 0) <= Number(product.seuil_alerte || 0));
    const paidOrders = data.orders.filter((order) => order.statut === 'payee' || order.statut === 'cloturee').length;
    const orderSuccessRate = data.orders.length ? Math.round((paidOrders / data.orders.length) * 100) : 0;
    const paymentSuccessRate = data.payments.length ? Math.round((paidPayments.length / data.payments.length) * 100) : 0;

    return { clients, vendors, admins, revenue, pendingShops, lowStock, orderSuccessRate, paymentSuccessRate };
  }, [data]);

  const charts = useMemo(() => {
    const ordersByStatus = countBy(data.orders, 'statut');
    const paymentsByStatus = countBy(data.payments, 'statut');
    const categoryNames = Object.fromEntries(data.categories.map((category) => [category.id, category.nom]));
    const productsByCategory = data.products.reduce((acc, product) => {
      const name = categoryNames[product.categorie] || 'Sans categorie';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    return {
      orders: {
        labels: Object.keys(ordersByStatus),
        series: Object.values(ordersByStatus)
      },
      payments: {
        labels: Object.keys(paymentsByStatus),
        series: Object.values(paymentsByStatus)
      },
      products: {
        labels: Object.keys(productsByCategory),
        series: Object.values(productsByCategory)
      }
    };
  }, [data]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h3">Tableau de bord MV Market</Typography>
        <Typography variant="body2" color="text.secondary">
          Vue globale du backoffice: utilisateurs, vendeurs, catalogue, commandes et paiements.
        </Typography>
      </Grid>

      {error && (
        <Grid size={12}>
          <Alert severity="warning">{error}</Alert>
        </Grid>
      )}

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Utilisateurs" value={data.users.length} caption={`${metrics.clients} clients, ${metrics.vendors} vendeurs`} icon={IconUsers} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Boutiques"
          value={data.shops.length}
          caption={`${metrics.pendingShops.length} en attente de validation`}
          icon={IconBuildingStore}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Produits"
          value={data.products.length}
          caption={`${metrics.lowStock.length} produits en stock faible`}
          icon={IconPackage}
          color="secondary"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Revenus payes"
          value={money.format(metrics.revenue)}
          caption={`${metrics.paymentSuccessRate}% paiements reussis`}
          icon={IconCreditCard}
          color="success"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard
          title="Commandes par statut"
          labels={charts.orders.labels}
          series={charts.orders.series}
          colors={['#2196f3', '#00c853', '#ffab00', '#f44336']}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard
          title="Paiements par statut"
          labels={charts.payments.labels}
          series={charts.payments.series}
          colors={['#00c853', '#ffab00', '#f44336', '#7c4dff']}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard
          title="Produits par categorie"
          type="bar"
          labels={charts.products.labels}
          series={[{ name: 'Produits', data: charts.products.series }]}
          colors={['#673ab7']}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard title="Dernieres commandes">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Creation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.orders.slice(0, 6).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{String(order.id).slice(0, 8)}</TableCell>
                  <TableCell>{money.format(Number(order.total || 0))}</TableCell>
                  <TableCell>
                    <Chip size="small" color={statusColor(order.statut)} label={order.statut} />
                  </TableCell>
                  <TableCell>{order.cree_le ? new Date(order.cree_le).toLocaleDateString('fr-FR') : '-'}</TableCell>
                </TableRow>
              ))}
              {data.orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Aucune commande
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard title="Sante commerciale">
          <Stack sx={{ gap: 2 }}>
            <Box>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Paiements reussis</Typography>
                <Typography variant="body2">{metrics.paymentSuccessRate}%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={metrics.paymentSuccessRate} />
            </Box>
            <Box>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Commandes payees/cloturees</Typography>
                <Typography variant="body2">{metrics.orderSuccessRate}%</Typography>
              </Stack>
              <LinearProgress color="success" variant="determinate" value={metrics.orderSuccessRate} />
            </Box>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2">Categories</Typography>
              <Typography variant="h5">{data.categories.length}</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2">Administrateurs</Typography>
              <Typography variant="h5">{metrics.admins}</Typography>
            </Stack>
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Vendeurs a valider">
          <Stack sx={{ gap: 1 }}>
            {metrics.pendingShops.map((shop) => (
              <Stack key={shop.id} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1">{shop.nom}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Commission: {shop.taux_commission || 0}%
                  </Typography>
                </Box>
                <Chip color="warning" size="small" label={shop.statut} />
              </Stack>
            ))}
            {metrics.pendingShops.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Aucune boutique en attente.
              </Typography>
            )}
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Stock faible">
          <Stack sx={{ gap: 1 }}>
            {metrics.lowStock.map((product) => (
              <Stack key={product.id} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1">{product.titre}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Seuil: {product.seuil_alerte}
                  </Typography>
                </Box>
                <Chip color="error" size="small" label={`${product.stock} restant`} />
              </Stack>
            ))}
            {metrics.lowStock.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Aucun produit sous le seuil d'alerte.
              </Typography>
            )}
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
