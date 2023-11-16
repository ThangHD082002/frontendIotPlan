import { useState } from 'react';


import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppWidgetSummary from '../app-widget-summary';

import Grid from '@mui/material/Unstable_Grid2';

import { users } from 'src/_mock/user';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserPage() {

  // const [order, setOrder] = useState('asc');


  // const [orderBy, setOrderBy] = useState('name');

  // const [filterName, setFilterName] = useState('');




  // const dataFiltered = applyFilter({
  //   inputData: users,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  // });

  // const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Cài đặt</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Thêm chức năng
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="New Users"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="New Users"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="New Users"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>
       
      </Grid>
    </Container>
  );
}
