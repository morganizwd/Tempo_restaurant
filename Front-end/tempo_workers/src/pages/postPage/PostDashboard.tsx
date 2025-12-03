import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PostDto } from '../../api/PostApi';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Инициализация pdfMake с шрифтами
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
}

interface PostDashboardProps {
  posts: PostDto[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PostDashboard: React.FC<PostDashboardProps> = ({ posts }) => {
  // Вычисляем общую статистику
  const totalStats = {
    likes: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
    views: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    reposts: posts.reduce((sum, post) => sum + (post.reposts || 0), 0),
    comments: posts.reduce((sum, post) => sum + (post.comments || 0), 0),
  };

  // Данные для графика по времени (последние 7 дней)
  const getTimeSeriesData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((date) => {
      const dayPosts = posts.filter((post) => {
        const postDate = new Date(post.createdAt).toISOString().split('T')[0];
        return postDate === date;
      });

      return {
        date: new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
        likes: dayPosts.reduce((sum, p) => sum + (p.likes || 0), 0),
        views: dayPosts.reduce((sum, p) => sum + (p.views || 0), 0),
        reposts: dayPosts.reduce((sum, p) => sum + (p.reposts || 0), 0),
        comments: dayPosts.reduce((sum, p) => sum + (p.comments || 0), 0),
      };
    });
  };

  // Данные для столбчатой диаграммы (топ-10 постов по просмотрам)
  const getTopPostsData = () => {
    return posts
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)
      .map((post) => ({
        name: post.dishName.length > 15 ? post.dishName.substring(0, 15) + '...' : post.dishName,
        views: post.views || 0,
        likes: post.likes || 0,
        comments: post.comments || 0,
      }));
  };

  // Данные для круговой диаграммы
  const pieData = [
    { name: 'Лайки', value: totalStats.likes },
    { name: 'Просмотры', value: totalStats.views },
    { name: 'Репосты', value: totalStats.reposts },
    { name: 'Комментарии', value: totalStats.comments },
  ].filter((item) => item.value > 0);

  const timeSeriesData = getTimeSeriesData();
  const topPostsData = getTopPostsData();

  // Функция экспорта в Excel
  const exportToExcel = () => {
    // Создаем новую книгу
    const wb = XLSX.utils.book_new();

    // Лист 1: Общая статистика
    const statsData = [
      ['Метрика', 'Значение'],
      ['Всего лайков', totalStats.likes],
      ['Всего просмотров', totalStats.views],
      ['Всего репостов', totalStats.reposts],
      ['Всего комментариев', totalStats.comments],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Общая статистика');

    // Лист 2: Динамика за 7 дней
    const timeData = [
      ['Дата', 'Просмотры', 'Лайки', 'Комментарии', 'Репосты'],
      ...timeSeriesData.map((item) => [
        item.date,
        item.views,
        item.likes,
        item.comments,
        item.reposts,
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(timeData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Динамика за 7 дней');

    // Лист 3: Топ постов
    const topPostsDataFull = posts
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);
    const topData = [
      ['Название блюда', 'Просмотры', 'Лайки', 'Комментарии', 'Репосты', 'Дата создания'],
      ...topPostsDataFull.map((post) => [
        post.dishName,
        post.views || 0,
        post.likes || 0,
        post.comments || 0,
        post.reposts || 0,
        new Date(post.createdAt).toLocaleDateString('ru-RU'),
      ]),
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(topData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Топ-10 постов');

    // Лист 4: Все посты
    const allPostsData = [
      ['Название блюда', 'Просмотры', 'Лайки', 'Комментарии', 'Репосты', 'Дата создания'],
      ...posts.map((post) => [
        post.dishName,
        post.views || 0,
        post.likes || 0,
        post.comments || 0,
        post.reposts || 0,
        new Date(post.createdAt).toLocaleDateString('ru-RU'),
      ]),
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(allPostsData);
    XLSX.utils.book_append_sheet(wb, ws4, 'Все посты');

    // Сохраняем файл
    const fileName = `Статистика_постов_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Функция экспорта в PDF
  const exportToPDF = () => {
    const docDefinition: any = {
      content: [
        {
          text: '📊 Отчет по статистике постов',
          style: 'header',
        },
        {
          text: `Дата создания: ${new Date().toLocaleDateString('ru-RU')}`,
          style: 'subheader',
          margin: [0, 0, 0, 15],
        },
        {
          text: 'Общая статистика',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [
                { text: 'Метрика', style: 'tableHeader' },
                { text: 'Значение', style: 'tableHeader' },
              ],
              ['Всего лайков', totalStats.likes.toLocaleString('ru-RU')],
              ['Всего просмотров', totalStats.views.toLocaleString('ru-RU')],
              ['Всего репостов', totalStats.reposts.toLocaleString('ru-RU')],
              ['Всего комментариев', totalStats.comments.toLocaleString('ru-RU')],
            ],
          },
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Динамика за последние 7 дней',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Дата', style: 'tableHeader' },
                { text: 'Просмотры', style: 'tableHeader' },
                { text: 'Лайки', style: 'tableHeader' },
                { text: 'Комментарии', style: 'tableHeader' },
                { text: 'Репосты', style: 'tableHeader' },
              ],
              ...timeSeriesData.map((item) => [
                item.date,
                item.views.toString(),
                item.likes.toString(),
                item.comments.toString(),
                item.reposts.toString(),
              ]),
            ],
          },
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Топ-10 постов по просмотрам',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Название блюда', style: 'tableHeader' },
                { text: 'Просмотры', style: 'tableHeader' },
                { text: 'Лайки', style: 'tableHeader' },
                { text: 'Комментарии', style: 'tableHeader' },
                { text: 'Репосты', style: 'tableHeader' },
              ],
              ...posts
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 10)
                .map((post) => [
                  post.dishName.length > 40 ? post.dishName.substring(0, 40) + '...' : post.dishName,
                  (post.views || 0).toString(),
                  (post.likes || 0).toString(),
                  (post.comments || 0).toString(),
                  (post.reposts || 0).toString(),
                ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'left',
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 12,
          alignment: 'left',
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          alignment: 'left',
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'white',
          fillColor: '#ff6b35',
          alignment: 'center',
        },
      },
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
      },
    };

    pdfMake.createPdf(docDefinition).download(
      `Статистика_постов_${new Date().toISOString().split('T')[0]}.pdf`
    );
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
              {value.toLocaleString('ru-RU')}
            </Typography>
          </Box>
          <Box sx={{ color: color, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          📊 Статистика постов
        </Typography>
        <ButtonGroup variant="contained" size="medium">
          <Button
            startIcon={<TableChartIcon />}
            onClick={exportToExcel}
            sx={{
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
              },
            }}
          >
            Экспорт в Excel
          </Button>
          <Button
            startIcon={<PictureAsPdfIcon />}
            onClick={exportToPDF}
            sx={{
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
              },
            }}
          >
            Экспорт в PDF
          </Button>
        </ButtonGroup>
      </Box>

      {/* Карточки с общей статистикой */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Всего лайков"
            value={totalStats.likes}
            icon={<FavoriteIcon sx={{ fontSize: 40 }} />}
            color="#e91e63"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Всего просмотров"
            value={totalStats.views}
            icon={<VisibilityIcon sx={{ fontSize: 40 }} />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Всего репостов"
            value={totalStats.reposts}
            icon={<ShareIcon sx={{ fontSize: 40 }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Всего комментариев"
            value={totalStats.comments}
            icon={<CommentIcon sx={{ fontSize: 40 }} />}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* График по времени */}
        <Paper sx={{ p: 3, height: 600, width: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            📈 Динамика за последние 7 дней
          </Typography>
          <ResponsiveContainer width="100%" height="92%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#2196f3" strokeWidth={2} name="Просмотры" />
              <Line type="monotone" dataKey="likes" stroke="#e91e63" strokeWidth={2} name="Лайки" />
              <Line type="monotone" dataKey="comments" stroke="#ff9800" strokeWidth={2} name="Комментарии" />
              <Line type="monotone" dataKey="reposts" stroke="#4caf50" strokeWidth={2} name="Репосты" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Круговая диаграмма */}
        <Paper sx={{ p: 3, height: 600, width: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            🥧 Распределение метрик
          </Typography>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="92%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={180}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography color="text.secondary">Нет данных для отображения</Typography>
            </Box>
          )}
        </Paper>

        {/* Столбчатая диаграмма топ постов */}
        <Paper sx={{ p: 3, height: 600, width: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            🏆 Топ-10 постов по просмотрам
          </Typography>
          {topPostsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="92%">
              <BarChart data={topPostsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#2196f3" name="Просмотры" />
                <Bar dataKey="likes" fill="#e91e63" name="Лайки" />
                <Bar dataKey="comments" fill="#ff9800" name="Комментарии" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography color="text.secondary">Нет данных для отображения</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default PostDashboard;

