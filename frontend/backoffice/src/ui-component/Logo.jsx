import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ==============================|| LOGO SVG ||============================== //

export default function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'common.white',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 800
        }}
      >
        MV
      </Box>
      <Box>
        <Typography variant="h3" sx={{ lineHeight: 1 }}>
          MV Market
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Backoffice
        </Typography>
      </Box>
    </Box>
  );
}
