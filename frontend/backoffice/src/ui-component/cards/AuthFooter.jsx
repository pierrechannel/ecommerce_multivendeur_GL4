import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

export default function AuthFooter() {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
      <Typography variant="subtitle2">MV Market Backoffice</Typography>
      <Typography variant="subtitle2">&copy; Groupe 1</Typography>
    </Stack>
  );
}
