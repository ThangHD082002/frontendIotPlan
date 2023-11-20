import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Trang chủ',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Cài đặt',
    path: '/setting/home/',
    icon: icon('ic_user'),
  },
  {
    title: 'Lịch sử',
    path: '/thongke/',
    icon: icon('ic_blog'),
  },

];

export default navConfig;
