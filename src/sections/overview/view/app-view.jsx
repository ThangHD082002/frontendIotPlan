import { useState, useEffect } from "react";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import IronIcon from '@mui/icons-material/Iron';
import OpacityIcon from '@mui/icons-material/Opacity';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

const chatSocket = new WebSocket("ws://iotplan.onrender.com/ws/chat/2/");

export default function AppView() {
  // const [door, setDoor] = useState(true);
  // const [name, setName] = useState('');
  const [nhietdo, setNhietdo] = useState('');
  const [doam, setDoam] = useState('');
  const [arrNhietdo, setArrNhietdo] = useState([]);
  const [arrDoam, setArrDoam] = useState([]);

  const [chat, setChat] = useState([]);

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

        console.log("Số:", roundedNumber);
        console.log("Sensor", sensor);
        console.log("Ngày giờ:", dateTimePart);
        if(sensor.toString() === "nhietdo"){
          const newObject = {
            'title': sensor,
            'temperature': roundedNumber, 
            'datetime': dateTimePart
          }
          setArrNhietdo(prevArr => [...prevArr, newObject]);
          console.log(arrNhietdo);
          setNhietdo(roundedNumber);
        } else{
          const newObject = {
            'title': sensor,
            'humanlity': roundedNumber, 
            'datetime': dateTimePart
          }
          setArrDoam(prevArr => [...prevArr, newObject]);
          console.log(arrDoam);
          setDoam(roundedNumber);
        }
    } else {
        console.log("Không tìm thấy số và chuỗi trong chuỗi.");
    }
    }
  };

  const datetimeArray = arrNhietdo.map(item => item.datetime);
  const nhietdoArray = arrNhietdo.map(item => item.temperature);


  const datetimeArrayDoam = arrDoam.map(item => item.datetime);
  const doamArray = arrDoam.map(item => item.humanlity);

  console.log("datetimeArray: " ,datetimeArray);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Nhiệt độ"
            total={`${nhietdo} °C`}
            color="success"
            // icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            icon={<DeviceThermostatIcon sx={{ fontSize: 60, m: 0.8, color: 'green' }} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Độ ẩm không khí"
            total={`${doam} %`}
            color="info"
            // icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
            icon={<OpacityIcon sx={{ fontSize: 60, m: 0.8, color: '#1877f2' }} />}
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
            total={`${90} %`}
            color="error"
            icon={<WaterDropIcon sx={{ fontSize: 60, m: 0.8, color: '#00b8d9' }} />}
          />
        </Grid>
        <Grid  container xs={12} sm={12} md={12} >
        <Grid xs={12} sm={6}>
          <AppWebsiteVisits
            title="Biểu đồ nhiệt độ"
            subheader="Cập nhật gần nhất"
            chart={{
              labels: datetimeArray,
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
        <Grid xs={12} md={12} lg={6} sx={6}>
          <AppWebsiteVisits
            title="Biểu đồ độ ẩm"
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
        </Grid>
        
      </Grid>
    </Container>
  );
}
