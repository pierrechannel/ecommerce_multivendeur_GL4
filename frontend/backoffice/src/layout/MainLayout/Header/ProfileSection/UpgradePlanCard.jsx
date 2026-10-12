// material-ui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// ==============================|| PROFILE MENU - UPGRADE PLAN CARD ||============================== //

export default function UpgradePlanCard() {
  const cardSX = {
    content: '""',
    position: 'absolute',
    width: 200,
    height: 200,
    borderColor: 'warning.main'
  };

  return (
    <Card
      sx={{
        bgcolor: 'warning.light',
        my: 2,
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          border: '19px solid ',
          borderRadius: '50%',
          top: '65px',
          right: '-150px',
          ...cardSX
        },
        '&:before': {
          border: '3px solid ',
          borderRadius: '50%',
          top: '145px',
          right: '-70px',
          ...cardSX
        }
      }}
    >
      <CardContent>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h4">Mode administration</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'grey.900',
              opacity: 0.6
            }}
          >
            Validez les vendeurs, suivez les commandes et controlez les paiements depuis cet espace.
          </Typography>
          <Stack direction="row">
            <AnimateButton>
              <Button variant="contained" color="warning" sx={{ boxShadow: 'none' }}>
                MV Market
              </Button>
            </AnimateButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
