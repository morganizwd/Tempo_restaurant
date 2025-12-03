import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
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
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        📊 Статистика постов
      </Typography>

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

      <Grid container spacing={3}>
        {/* График по времени */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              📈 Динамика за последние 7 дней
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
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
        </Grid>

        {/* Круговая диаграмма */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              🥧 Распределение метрик
            </Typography>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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
        </Grid>

        {/* Столбчатая диаграмма топ постов */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              🏆 Топ-10 постов по просмотрам
            </Typography>
            {topPostsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={topPostsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostDashboard;

