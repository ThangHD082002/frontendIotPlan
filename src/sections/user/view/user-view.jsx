import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

const chatSocket = new WebSocket('ws://localhost:8000/ws/chat/2/');

export default function UserPage() {
  
  const [onWatering, setOnwatering] = useState('');
  const [chat, setChat] = useState([]);
  const [auto, setAuto] = useState(false);

  // const [orderBy, setOrderBy] = useState('name');

  // const [filterName, setFilterName] = useState('');

  // const dataFiltered = applyFilter({
  //   inputData: users,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  // });

  // const notFound = !dataFiltered.length && !!filterName;

  useEffect(() => {
    // Lấy giá trị từ local storage (hoặc nơi lưu trữ khác) khi component được tạo
    const savedAuto = localStorage.getItem('savedAuto');

    // Nếu giá trị tồn tại, cập nhật state
    if (savedAuto !== null) {
      setAuto(savedAuto === 'true');
    }
  }, []);

  useEffect(() => {
    chatSocket.onopen = () => {
      console.log('websocket connected');
    };

    chatSocket.onclose = () => {
      console.log('websocket disconnected');
    };
  }, []);

  chatSocket.onmessage = (message) => {
    const dataFromServer = JSON.parse(message.data);
    if (dataFromServer) {
      setChat([...chat, { msg: dataFromServer.message, name: dataFromServer.name }]);
      console.log(dataFromServer.message);
    }
  };

  function enviar(x) {
    chatSocket.send(
        JSON.stringify({
            type: "on/off may bom",
            message: x,
            name: "may bom",
        })
    );
}

  const handleAuto= (e) => {
    setAuto(!auto);
    localStorage.setItem('savedAuto',!auto);
    var x = (!auto).toString() + " auto";
    enviar(x);
  };

  const handleWatering= (e) => {
    setOnwatering(e.target.checked.toString());
    var x = e.target.checked.toString() + " water";
    enviar(x);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3">Cài đặt hệ thống </Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Thêm chức năng
        </Button>
      </Stack>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={6}>
          <AppWidgetSummary 
          title="Hệ thống tự động" 
          color="info" 
          x = {<Switch
            color="primary"
            // checked={this.state.active}
            onChange={handleAuto}
            checked={auto}
          />}/>
        </Grid>
        <Grid xs={12} sm={6} md={6}>
          <AppWidgetSummary 
          title="Đặt thời gian tưới" 
          color="info" />
          {/* <DateCalendar /> */}
        </Grid>
        <Grid xs={12} sm={6} md={6}>
          <AppWidgetSummary title="Cài đặt ngưỡng" color="info" />
        </Grid>

        <Grid xs={12} sm={6} md={6}>
          <AppWidgetSummary 
          title="Tưới cây" 
          color="info" 
          x = {<Switch
            color="success"
            onChange={handleWatering}
            // checked={this.state.active}
            disabled={auto === true}
          />}/>
        </Grid>
      </Grid>
    </Container>
  );
}
