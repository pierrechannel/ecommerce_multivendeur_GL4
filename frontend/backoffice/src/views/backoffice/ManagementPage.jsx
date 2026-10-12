import { useEffect, useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MainCard from 'ui-component/cards/MainCard';

import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { apiGet, apiRequest } from 'services/api';

function normalizeRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function buildInitialForm(fields, row) {
  return fields.reduce((acc, field) => {
    acc[field.key] = row?.[field.key] ?? field.defaultValue ?? '';
    return acc;
  }, {});
}

export default function ManagementPage({ title, description, endpoint, columns, fields, getFields, beforeSave }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const activeFields = useMemo(() => (getFields ? getFields(rows) : fields), [fields, getFields, rows]);
  const [form, setForm] = useState({});

  const loadRows = async () => {
    setLoading(true);
    setError('');
    try {
      setRows(normalizeRows(await apiGet(endpoint)));
    } catch {
      setError("Impossible de charger les donnees depuis l'API Django.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, [endpoint]);

  const openCreate = () => {
    setEditingRow(null);
    setForm(buildInitialForm(activeFields));
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setForm(buildInitialForm(activeFields, row));
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    setForm({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const editableFields = activeFields.filter((field) => !field.readOnly && !(editingRow && field.createOnly));
    let payload = editableFields.reduce((acc, field) => {
      if (field.omitWhenBlank && !form[field.key]) return acc;
      acc[field.key] = form[field.key] === '' ? null : form[field.key];
      return acc;
    }, {});
    payload = beforeSave ? beforeSave(payload, editingRow) : payload;

    try {
      await apiRequest(editingRow ? `${endpoint}${editingRow.id}/` : endpoint, {
        method: editingRow ? 'PATCH' : 'POST',
        body: JSON.stringify(payload)
      });
      closeDialog();
      await loadRows();
    } catch {
      setError("Enregistrement impossible. Verifiez les champs et vos droits d'administration.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm('Confirmer la suppression ?')) return;

    setError('');
    try {
      await apiRequest(`${endpoint}${row.id}/`, { method: 'DELETE' });
      await loadRows();
    } catch {
      setError("Suppression impossible. L'element est peut-etre utilise par une autre table.");
    }
  };

  return (
    <MainCard
      title={title}
      secondary={
        <Button startIcon={<IconPlus size={18} />} variant="contained" onClick={openCreate}>
          Ajouter
        </Button>
      }
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.label}</TableCell>
                ))}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.render ? column.render(row) : row[column.key]}</TableCell>
                  ))}
                  <TableCell align="right">
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => openEdit(row)}>
                        <IconEdit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton color="error" size="small" onClick={() => handleDelete(row)}>
                        <IconTrash size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    Aucun enregistrement
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>{editingRow ? 'Modifier' : 'Ajouter'}</DialogTitle>
          <DialogContent>
            <Stack sx={{ gap: 2, pt: 1 }}>
              {activeFields
                .filter((field) => !(editingRow && field.createOnly))
                .map((field) => (
                  <TextField
                    key={field.key}
                    select={field.type === 'select'}
                    label={field.label}
                    type={field.type && field.type !== 'select' ? field.type : 'text'}
                    value={form[field.key] ?? ''}
                    required={field.required}
                    multiline={field.multiline}
                    minRows={field.multiline ? 3 : undefined}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                    fullWidth
                  >
                    {field.type === 'select' &&
                      (field.options || []).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </TextField>
                ))}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainCard>
  );
}
