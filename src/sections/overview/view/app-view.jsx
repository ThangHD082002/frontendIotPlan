import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import IronIcon from '@mui/icons-material/Iron';
import OpacityIcon from '@mui/icons-material/Opacity';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

const chatSocket = new WebSocket('wss://iotplan.onrender.com/ws/chat/2/');



// const chatSocket = new WebSocket('ws://localhost:8000/ws/chat/2/');

export default function AppView() {
  // const [door, setDoor] = useState(true);
  // const [name, setName] = useState('');
  const [nhietdo, setNhietdo] = useState('');
  const [doam, setDoam] = useState('');
  const [doamdat, setDoamdat] = useState('');

  const [countNhietdo, setCountNhietdo] = useState(0);
  const [countDoam, setCountDoam] = useState(0);
  const [countDoamdat, setCountDoamdat] = useState(0);

  const [arrNhietdo, setArrNhietdo] = useState([]);
  const [arrDoam, setArrDoam] = useState([]);
  const [arrDoamDat, setArrDoamDat] = useState([]);

  const [chat, setChat] = useState([]);
  const [lc, setLc] = useState(true);

  // useEffect(() => {
  //   if(nhietdo === ''){
  //     localStorage.removeItem('arrNhietdolc');
  //   }
  //   if(doam === ''){
  //     localStorage.removeItem('arrDoamlc');
  //   }
  //   if(doamdat === ''){
  //     localStorage.removeItem('arrDoamdatlc');
  //   }
  // }, [nhietdo,doam , doamdat]);

  // useEffect(() => {
  //   console.log('nhiet do lc: ', localStorage.getItem('arrNhietdolc'));
  //   console.log('Do am lc: ', localStorage.getItem('arrDoamlc'));
  //   console.log('Do am dat lc: ', localStorage.getItem('arrDoamdatlc'));
  // }, [lc]);

  useEffect(() => {
    console.log('nhiet do lc: ', localStorage.getItem('arrNhietdolc'));
    console.log('Do am lc: ', localStorage.getItem('arrDoamlc'));
    console.log('Do am dat lc: ', localStorage.getItem('arrDoamdatlc'));
  }, [lc]);

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
      // console.log(dataFromServer.message);
      const messIot = dataFromServer.message.toString();
      // Loại bỏ ký tự "b" và dấu nháy đơn ở đầu và cuối chuỗi
      const cleanedString = messIot.slice(2, -1);

      // Chia chuỗi thành mảng các thành phần
      const parts = cleanedString.split(' ');

      // Chuyển đổi từng thành phần thành số hoặc chuỗi ngày giờ
      const num1 = parseFloat(parts[0]);
      const num2 = parseFloat(parts[1]);
      const num3 = parseFloat(parts[2]);
      const dateTime = parts.slice(3).join(' ');

      const roundedNum1 = Math.round(num1 * 10) / 10;
      const roundedNum2 = Math.round(num2 * 10) / 10;
      const roundedNum3 = Math.round(num3 * 10) / 10;

      const nhietDo = roundedNum1.toString();
      const doAm = roundedNum2.toString();
      const doAmdat = roundedNum3.toString();
      const dateTimeString = String(dateTime);

      console.log('nhiet do:', nhietDo);
      console.log('do am:', doAm);
      console.log('do am dat:', doAmdat);
      console.log('Date Time:', dateTimeString );



      const newObjectNhietdo = {
        title: 'nhiệt độ',
        temperature: nhietDo,
        datetime: dateTimeString,
      };
      const storedArrayNhietdo = JSON.parse(localStorage.getItem('arrNhietdolc')) || [];
      storedArrayNhietdo.push(newObjectNhietdo);
      if (storedArrayNhietdo.length < 25) {
        localStorage.setItem('arrNhietdolc', JSON.stringify(storedArrayNhietdo));
      } else {
        localStorage.setItem('arrNhietdolc', JSON.stringify([]));
      }
      // console.log(arrNhietdo);


      const newObjectDoam = {
        title: "độ ẩm",
        humanlity: doAm,
        datetime: dateTimeString,
      };
      const storedArrayDoam = JSON.parse(localStorage.getItem('arrDoamlc')) || [];
      storedArrayDoam.push(newObjectDoam );
      if (storedArrayDoam.length < 25) {
        localStorage.setItem('arrDoamlc', JSON.stringify(storedArrayDoam));
      } else {
        localStorage.setItem('arrDoamlc', JSON.stringify([]));
      }


      const newObjectDoamdat = {
        title: "độ ẩm đất",
        doAmDat: doAmdat,
        datetime: dateTimeString,
      };
      const storedArrayDoamdat = JSON.parse(localStorage.getItem('arrDoamdatlc')) || [];
      storedArrayDoamdat.push(newObjectDoamdat);
      if (storedArrayDoamdat.length < 25) {
        localStorage.setItem('arrDoamdatlc', JSON.stringify(storedArrayDoamdat));
      } else {
        localStorage.setItem('arrDoamdatlc', JSON.stringify([]));
      }


      setLc(!lc);
      // console.log(arrDoamDat);
      setNhietdo(nhietDo);
      setArrNhietdo((prevArr) => [...prevArr, newObjectNhietdo]);
      setDoam(doAm);
      setArrDoam((prevArr) => [...prevArr, newObjectDoam]);
      setDoamdat(doAmdat);
      setArrDoamDat((prevArr) => [...prevArr, newObjectDoamdat]);
    } else {
      console.log('Không tìm thấy số và chuỗi trong chuỗi.');
    }
  };

  const arrNhietdolcChart = JSON.parse(localStorage.getItem('arrNhietdolc')) || [];
  const arrDoamlcChart = JSON.parse(localStorage.getItem('arrDoamlc')) || [];
  const arrDoamdatlcChart = JSON.parse(localStorage.getItem('arrDoamdatlc')) || [];

  const datetimeArrayNhietdo = arrNhietdolcChart.map((item) => item.datetime);
  const nhietdoArray = arrNhietdolcChart.map((item) => item.temperature);

  const datetimeArrayDoam = arrDoamlcChart.map((item) => item.datetime);
  const doamArray = arrDoamlcChart.map((item) => item.humanlity);

  // const datetimeArrayDoamdat = arrDoamDat.map((item) => item.datetime);
  const datetimeArrayDoamdat = arrDoamdatlcChart.map((item) => item.datetime);
  const doamdatArray = arrDoamdatlcChart.map((item) => item.doAmDat);
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Nhiệt độ"
            total={`${nhietdo} °C`}
            color="success"
            // icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            icon={<DeviceThermostatIcon sx={{ fontSize: 60, m: 0.8, color: '#ffab00' }} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Độ ẩm không khí"
            total={`${doam} %`}
            color="info"
            // icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
            icon={<OpacityIcon sx={{ fontSize: 60, m: 0.8, color: '#00b8d9' }} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Lượng nước đã tưới"
            total={`${172} ml`}
            color="warning"
            icon={<IronIcon sx={{ fontSize: 60, m: 0.8, color: '#fb8d67' }} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Độ ẩm đất"
            total={`${doamdat} %`}
            color="error"
            icon={<WaterDropIcon sx={{ fontSize: 60, m: 0.8, color: '#ff5630' }} />}
          />
        </Grid>
        <Grid container xs={12} sm={12} md={12} spacing={2}>
          <Grid xs={12} sm={6} item>
            <AppWebsiteVisits
              title="Biểu đồ nhiệt độ"
              subheader="Cập nhật gần nhất"
              chart={{
                labels: datetimeArrayNhietdo,
                series: [
                  {
                    name: 'Nhiệt độ',
                    type: 'area',
                    fill: 'gradient',
                    data: nhietdoArray,
                  },
                  // {
                  //   name: 'Team C',
                  //   type: 'line',
                  //   fill: 'solid',
                  //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  // },
                ],
              }}
            />
          </Grid>
          <Grid xs={12} md={12} lg={6} sx={6} item>
            <AppWebsiteVisits
              title="Biểu đồ độ ẩm không khí"
              subheader="Cập nhật gần nhất"
              chart={{
                labels: datetimeArrayDoam,
                series: [
                  // {
                  //   name: 'Team A',
                  //   type: 'column',
                  //   fill: 'solid',
                  //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  // },
                  {
                    name: 'Độ ẩm',
                    type: 'area',
                    fill: 'gradient',
                    data: doamArray,
                  },
                ],
                tooltip: {
                  y: {
                    formatter: (value) => {
                      if (typeof value !== 'undefined') {
                        return `${value.toFixed(1)} °C`;
                      }
                      return value;
                    },
                  },
                },
              }}
            />
          </Grid>
          <Grid xs={12} sm={8} item mx="auto">
            <AppWebsiteVisits
              title="Biểu đồ độ ẩm đất"
              subheader="Cập nhật gần nhất"
              chart={{
                labels: datetimeArrayDoamdat,
                series: [
                  {
                    name: 'Độ ẩm đất',
                    type: 'line',
                    fill: 'solid',
                    data: doamdatArray,
                  },
                  // {
                  //   name: 'Team C',
                  //   type: 'line',
                  //   fill: 'solid',
                  //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  // },
                ],
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
