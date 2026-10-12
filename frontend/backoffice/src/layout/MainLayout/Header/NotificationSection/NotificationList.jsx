import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { withAlpha } from 'utils/colorUtils';

// assets
import { IconBrandTelegram, IconBuildingStore, IconCreditCard, IconPackage, IconReceipt } from '@tabler/icons-react';
import User1 from 'assets/images/users/user-round.svg';

function ListItemWrapper({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: withAlpha(theme.palette.grey[200], 0.3)
        }
      }}
    >
      {children}
    </Box>
  );
}

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export default function NotificationList() {
  const containerSX = { gap: 2, pl: 7 };

  return (
    <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 min ago</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar alt="Administrateur" src={User1} />
          </ListItemAvatar>
          <ListItemText primary="Nouvelle commande" />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">Une commande client vient d'etre creee et attend le paiement.</Typography>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Chip label="Non lue" color="error" size="small" sx={{ width: 'min-content' }} />
            <Chip label="Nouvelle" color="warning" size="small" sx={{ width: 'min-content' }} />
          </Stack>
        </Stack>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 min ago</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                color: 'success.dark',
                bgcolor: 'success.light'
              }}
            >
              <IconBuildingStore stroke={1.5} size="20px" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">Boutique a valider</Typography>} />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">Un vendeur a soumis une boutique pour validation.</Typography>
          <Chip label="Non lue" color="error" size="small" sx={{ width: 'min-content' }} />
        </Stack>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 min ago</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                color: 'primary.dark',
                bgcolor: 'primary.light'
              }}
            >
              <IconCreditCard stroke={1.5} size="20px" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">Paiement recu</Typography>} />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">Une transaction Mobile Money a ete confirmee par la passerelle.</Typography>
          <Button variant="contained" endIcon={<IconBrandTelegram stroke={1.5} size={20} />} sx={{ width: 'min-content' }}>
            Ouvrir
          </Button>
        </Stack>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 min ago</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                color: 'secondary.dark',
                bgcolor: 'secondary.light'
              }}
            >
              <IconPackage stroke={1.5} size="20px" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">Stock faible</Typography>} />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">Un produit approche de son seuil d'alerte.</Typography>
          <Chip label="Catalogue" color="secondary" size="small" sx={{ width: 'min-content' }} />
        </Stack>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 min ago</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                color: 'success.dark',
                bgcolor: 'success.light'
              }}
            >
              <IconReceipt stroke={1.5} size="20px" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">Commande cloturee</Typography>} />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">Une commande livree a ete cloturee avec succes.</Typography>
          <Chip label="Confirmee" color="success" size="small" sx={{ width: 'min-content' }} />
        </Stack>
      </ListItemWrapper>
    </List>
  );
}

ListItemWrapper.propTypes = { children: PropTypes.node };
