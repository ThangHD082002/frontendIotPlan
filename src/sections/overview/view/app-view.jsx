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

  const [arrNhietdo, setArrNhietdo] = useState([]);
  const [arrDoam, setArrDoam] = useState([]);
  const [arrDoamDat, setArrDoamDat] = useState([]);

  const [chat, setChat] = useState([]);
  const [lc, setLc] = useState(true);

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
      const regex = /b'([^']+)' (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+)/;
      const match = messIot.match(regex);
      if (match) {
        const numberPart = match[1]; // "27.29257486406868 doam"
        const dateTimePart = match[2];

        const [number, sensor] = numberPart.split(' ');

        // Chuyển đổi số từ chuỗi thành float và làm tròn đến số thập phân thứ nhất
        const roundedNumber = parseFloat(number).toFixed(1);

        // console.log("thời gian" + tg );

        console.log('Số:', roundedNumber);
        console.log('Sensor', sensor);
        console.log('Ngày giờ:', dateTimePart);
        if (sensor.toString() === 'nhietdo') {
          const newObject = {
            title: sensor,
            temperature: roundedNumber,
            datetime: dateTimePart,
          };
          setArrNhietdo((prevArr) => [...prevArr, newObject]);
          const storedArray = JSON.parse(localStorage.getItem('arrNhietdolc')) || [];
          storedArray.push(newObject);
          if (storedArray.length < 25) {
            localStorage.setItem('arrNhietdolc', JSON.stringify(storedArray));
          } else {
            localStorage.setItem('arrNhietdolc', JSON.stringify([]));
          }
          setLc(!lc);
          // console.log(arrNhietdo);
          setNhietdo(roundedNumber);
        } else if (sensor.toString() === 'doam') {
          const newObject = {
            title: sensor,
            humanlity: roundedNumber,
            datetime: dateTimePart,
          };
          setArrDoam((prevArr) => [...prevArr, newObject]);
          const storedArray = JSON.parse(localStorage.getItem('arrDoamlc')) || [];
          storedArray.push(newObject);
          if (storedArray.length < 25) {
            localStorage.setItem('arrDoamlc', JSON.stringify(storedArray));
          } else {
            localStorage.setItem('arrDoamlc', JSON.stringify([]));
          }

          setLc(!lc);
          // console.log(arrDoam);
          setDoam(roundedNumber);
        } else {
          const newObject = {
            title: sensor,
            doAmDat: roundedNumber,
            datetime: dateTimePart,
          };
          setArrDoamDat((prevArr) => [...prevArr, newObject]);
          const storedArray = JSON.parse(localStorage.getItem('arrDoamdatlc')) || [];
          storedArray.push(newObject);
          if (storedArray.length < 25) {
            localStorage.setItem('arrDoamdatlc', JSON.stringify(storedArray));
          } else {
            localStorage.setItem('arrDoamdatlc', JSON.stringify([]));
          }
          setLc(!lc);
          // console.log(arrDoamDat);
          setDoamdat(roundedNumber);
        }
      }
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
        <Grid
          container
          xs={12}
          sm={12}
          md={12}
          spacing={2}
          
        >
          <Grid xs={12} sm={6} item >
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
