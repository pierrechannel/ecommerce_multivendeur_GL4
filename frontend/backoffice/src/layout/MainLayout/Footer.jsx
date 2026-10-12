import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 3, mt: 'auto' }}>
      <Typography variant="caption">&copy; 2026 MV Market. Tous droits reserves.</Typography>
      <Typography variant="caption" color="text.secondary">
        Administration e-commerce multi-vendeurs
      </Typography>
    </Stack>
  );
}
