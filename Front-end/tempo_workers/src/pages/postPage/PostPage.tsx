import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import InstagramIcon from '@mui/icons-material/Instagram';
import { PostApi, PostDto, CreatePostDto, UpdatePostStatsDto } from '../../api/PostApi';
import { useGlobalStore } from '../../shared/state/globalStore';
import DishesType from '../../shared/types/dishes';
import PostDashboard from './PostDashboard';
import './postPage.scss';

const PostPage = () => {
  const { Dishes, fetchDishes } = useGlobalStore();
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState<string>('');
  const [useAIGeneratedImage, setUseAIGeneratedImage] = useState(true);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState<string>(''); // Промпт для генерации изображения
  const [currentTab, setCurrentTab] = useState(0);
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostDto | null>(null);
  const [statsForm, setStatsForm] = useState<UpdatePostStatsDto>({
    likes: 0,
    views: 0,
    reposts: 0,
    comments: 0,
  });

  useEffect(() => {
    fetchDishes(1, 100);
    loadPosts();
    
    // Проверяем загрузку Puter.js
    const checkPuterLoaded = () => {
      if (typeof (window as any).puter !== 'undefined') {
        console.log('Puter.js загружен:', (window as any).puter);
      } else {
        console.warn('Puter.js еще не загружен');
        setTimeout(checkPuterLoaded, 500);
      }
    };
    
    // Проверяем через небольшую задержку
    setTimeout(checkPuterLoaded, 1000);
  }, []);

  // Генерируем начальный промпт при выборе блюда
  useEffect(() => {
    const generatePrompt = async () => {
      if (selectedDishId && useAIGeneratedImage && !selectedImageFile) {
        const selectedDish = Dishes.items?.find((d: DishesType) => d.id === selectedDishId);
        if (selectedDish && (!imagePrompt || imagePrompt.trim() === '')) {
          try {
            const initialPrompt = await generateInitialPrompt(selectedDish.name);
            setImagePrompt(initialPrompt);
          } catch (err) {
            console.error('Ошибка генерации начального промпта:', err);
          }
        }
      }
    };

    generatePrompt();
  }, [selectedDishId, useAIGeneratedImage, selectedImageFile]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const allPosts = await PostApi.getAllPosts();
      setPosts(allPosts);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки постов');
    } finally {
      setLoading(false);
    }
  };

  // Конвертирует data URL в File объект
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Переводит название блюда на английский язык
  const translateDishName = async (dishName: string): Promise<string> => {
    try {
      // Проверяем, нужно ли переводить (если уже на английском, возвращаем как есть)
      // Простая проверка: если содержит только латинские буквы и пробелы, считаем английским
      if (/^[a-zA-Z\s-]+$/.test(dishName.trim())) {
        console.log('Название уже на английском:', dishName);
        return dishName;
      }

      // Используем Google Translate API через публичный endpoint
      const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=en&dt=t&q=${encodeURIComponent(dishName)}`;
      
      const response = await fetch(translateUrl);
      if (!response.ok) {
        console.warn('Ошибка перевода, используем оригинальное название');
        return dishName;
      }

      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const translated = data[0][0][0];
        console.log('Переведено:', dishName, '->', translated);
        return translated;
      }

      return dishName;
    } catch (error) {
      console.error('Ошибка перевода:', error);
      // В случае ошибки возвращаем оригинальное название
      return dishName;
    }
  };

  // Генерирует начальный промпт на основе названия блюда
  const generateInitialPrompt = async (dishName: string): Promise<string> => {
    const translatedDishName = await translateDishName(dishName);
    return `Beautiful professional food photography of ${translatedDishName}, appetizing, high quality, restaurant style, Instagram worthy`;
  };

  const generateImageWithPuter = async (prompt: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      try {
        // Проверяем, что Puter.js загружен
        if (typeof window === 'undefined') {
          reject(new Error('Окно браузера недоступно'));
          return;
        }

        // Ждем загрузки Puter.js
        const checkPuter = () => {
          if (typeof (window as any).puter === 'undefined') {
            console.warn('Puter.js еще не загружен, ожидание...');
            setTimeout(checkPuter, 100);
            return;
          }

          const puter = (window as any).puter;
          
          if (!puter.ai || !puter.ai.txt2img) {
            reject(new Error('Puter.js загружен, но метод txt2img недоступен. Попробуйте обновить страницу.'));
            return;
          }

          console.log('Генерация изображения с промптом:', prompt);
          
          // Используем модель Flux Schnell Free по умолчанию
          const options = { model: 'black-forest-labs/FLUX.1-schnell-Free' };
          
          console.log('Используемая модель:', options.model);
          
          // Вызываем Puter.js с промптом и options
          puter.ai.txt2img(prompt, options)
            .then((result: any) => {
              console.log('Результат от Puter.js (полный):', result);
              console.log('Тип результата:', typeof result);
              console.log('result.success:', result?.success);
              console.log('result.error:', result?.error);
              
              // Проверяем, если это объект с ошибкой
              if (result && typeof result === 'object' && result.success === false) {
                console.error('=== ОБЪЕКТ ОШИБКИ ОТ PUTER.JS ===');
                console.error(JSON.stringify(result, null, 2));
                
                let errorMsg = 'Неизвестная ошибка от Puter.js';
                
                // Пытаемся извлечь сообщение об ошибке
                if (result.error) {
                  if (typeof result.error === 'string') {
                    errorMsg = result.error;
                  } else if (result.error.message) {
                    errorMsg = result.error.message;
                  } else if (result.error.toString && typeof result.error.toString === 'function') {
                    errorMsg = result.error.toString();
                  } else {
                    // Пытаемся найти любое текстовое сообщение в объекте ошибки
                    const errorStr = JSON.stringify(result.error);
                    errorMsg = errorStr !== '{}' ? errorStr : 'Ошибка от Puter.js';
                  }
                } else if (result.message) {
                  errorMsg = result.message;
                }
                
                console.error('Извлеченное сообщение об ошибке:', errorMsg);
                
                // Формируем понятное сообщение об ошибке
                reject(new Error(`Ошибка генерации изображения через Puter.js: ${errorMsg}. Попробуйте загрузить изображение вручную или повторите попытку позже.`));
                return;
              }

              // Проверяем, если это HTMLImageElement
              let imgElement: HTMLImageElement | null = null;
              if (result instanceof HTMLImageElement) {
                imgElement = result;
              } else if (result && result.src) {
                // Если это объект с src
                imgElement = result as HTMLImageElement;
              } else if (result && typeof result === 'string') {
                // Если это URL строки
                const img = new Image();
                img.src = result;
                imgElement = img;
              } else {
                console.error('Неожиданный формат ответа от Puter.js:', result);
                reject(new Error('Неожиданный формат ответа от Puter.js'));
                return;
              }

              if (!imgElement || !imgElement.src) {
                reject(new Error('Изображение не было сгенерировано'));
                return;
              }

              // Ждем загрузки изображения, если это URL
              const processImage = () => {
                // Конвертируем data URL в File для отправки на сервер
                if (imgElement!.src.startsWith('data:')) {
                  try {
                    const file = dataURLtoFile(imgElement!.src, `generated-${Date.now()}.png`);
                    console.log('Файл создан из data URL:', file);
                    resolve(file);
                  } catch (err: any) {
                    console.error('Ошибка конвертации data URL:', err);
                    reject(new Error(`Ошибка конвертации изображения: ${err.message || 'Неизвестная ошибка'}`));
                  }
                } else {
                  // Если это обычный URL, создаем файл из него
                  console.log('Загрузка изображения по URL:', imgElement!.src);
                  fetch(imgElement!.src)
                    .then(res => {
                      if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                      }
                      return res.blob();
                    })
                    .then(blob => {
                      const file = new File([blob], `generated-${Date.now()}.png`, { type: blob.type || 'image/png' });
                      console.log('Файл создан из URL:', file);
                      resolve(file);
                    })
                    .catch(err => {
                      console.error('Ошибка загрузки изображения:', err);
                      reject(new Error(`Ошибка загрузки изображения: ${err.message || 'Неизвестная ошибка'}`));
                    });
                }
              };

              // Если изображение уже загружено
              if (imgElement.complete || imgElement.src.startsWith('data:')) {
                processImage();
              } else {
                // Ждем загрузки изображения
                imgElement.onload = processImage;
                imgElement.onerror = () => {
                  reject(new Error('Ошибка загрузки изображения'));
                };
              }
            })
            .catch((err: any) => {
              console.error('Ошибка генерации изображения через Puter.js (catch):', err);
              console.error('Тип ошибки:', typeof err);
              console.error('err.error:', err?.error);
              console.error('err.message:', err?.message);
              
              let errorMessage = 'Неизвестная ошибка';
              
              // Пытаемся извлечь сообщение об ошибке
              if (err?.error?.message) {
                errorMessage = err.error.message;
              } else if (err?.message) {
                errorMessage = err.message;
              } else if (err?.error) {
                if (typeof err.error === 'string') {
                  errorMessage = err.error;
                } else {
                  errorMessage = JSON.stringify(err.error);
                }
              } else if (err?.toString) {
                errorMessage = err.toString();
              }
              
              reject(new Error(`Ошибка генерации изображения через Puter.js: ${errorMessage}. Попробуйте загрузить изображение вручную или повторите попытку позже.`));
            });
        };

        // Начинаем проверку
        checkPuter();
      } catch (err: any) {
        console.error('Критическая ошибка в generateImageWithPuter:', err);
        reject(new Error(`Критическая ошибка: ${err.message || 'Неизвестная ошибка'}`));
      }
    });
  };

  const handleCreatePost = async () => {
    if (!selectedDishId) {
      setError('Выберите блюдо');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let imageFileToSend: File | undefined = undefined;

      // Если выбрана генерация через AI
      if (useAIGeneratedImage && !selectedImageFile) {
        if (!imagePrompt || imagePrompt.trim() === '') {
          setError('Введите промпт для генерации изображения');
          setLoading(false);
          return;
        }

        setGeneratingImage(true);
        try {
          const generatedFile = await generateImageWithPuter(imagePrompt);
          imageFileToSend = generatedFile;
          
          // Показываем превью
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(generatedFile);
        } catch (err: any) {
          setError(err.message || 'Ошибка генерации изображения');
          setGeneratingImage(false);
          setLoading(false);
          return;
        } finally {
          setGeneratingImage(false);
        }
      }

      const createDto: CreatePostDto = {
        dishId: selectedDishId,
      };

      await PostApi.createPost(createDto, selectedImageFile || imageFileToSend);
      
      setOpenCreateDialog(false);
      setSelectedDishId('');
      setSelectedImageFile(null);
      setImagePreview(null);
      setUseAIGeneratedImage(true);
      setImagePrompt('');
      
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Ошибка создания поста');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      return;
    }

    try {
      await PostApi.deletePost(id);
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления поста');
    }
  };

  const handleEditStats = (post: PostDto) => {
    setSelectedPost(post);
    setStatsForm({
      likes: post.likes || 0,
      views: post.views || 0,
      reposts: post.reposts || 0,
      comments: post.comments || 0,
    });
    setOpenStatsDialog(true);
  };

  const handleSaveStats = async () => {
    if (!selectedPost) return;

    try {
      setLoading(true);
      await PostApi.updatePostStats(selectedPost.id, statsForm);
      await loadPosts();
      setOpenStatsDialog(false);
      setSelectedPost(null);
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления статистики');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async (post: PostDto) => {
    try {
      // Получаем полный URL изображения
      const imageUrl = post.imageUrl.startsWith('http') 
        ? post.imageUrl 
        : `${process.env.API_URL?.replace('/api', '')}${post.imageUrl}`;

      // Скачиваем изображение
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Создаем временную ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Определяем расширение файла из URL или используем по умолчанию
      const extension = post.imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)?.[0] || '.png';
      link.download = `${post.dishName}_${new Date(post.createdAt).toISOString().split('T')[0]}${extension}`;
      
      // Добавляем ссылку в DOM, кликаем и удаляем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Освобождаем память
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Ошибка скачивания изображения');
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setUseAIGeneratedImage(false);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderDishOptions = () => {
    if (!Dishes.items || Dishes.items.length === 0) {
      return <MenuItem disabled>Нет доступных блюд</MenuItem>;
    }

    return Dishes.items.map((dish: DishesType) => (
      <MenuItem key={dish.id} value={dish.id}>
        {dish.name}
      </MenuItem>
    ));
  };

  return (
    <div className="post-page-wrapper">
      <div className="post-wallpaper">
        <div className="menu-board">
          <div className="post-page">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <InstagramIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          AI Посты для Instagram
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateDialog(true)}
          startIcon={<InstagramIcon />}
        >
          Создать пост
        </Button>
      </Box>

      {/* Вкладки */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab icon={<InstagramIcon />} iconPosition="start" label="Посты" />
          <Tab icon={<BarChartIcon />} iconPosition="start" label="Статистика" />
        </Tabs>
      </Box>

      {/* Контент вкладок */}
      {currentTab === 1 && <PostDashboard posts={posts} />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {currentTab === 0 && (
        <>
          {loading && posts.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%', mt: 2 }}>
          <Grid 
            container 
            spacing={3}
            sx={{
              width: '100%',
              margin: 0,
              '& > .MuiGrid-item': {
                padding: '12px !important'
              }
            }}
          >
          {posts.map((post) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3} 
              key={post.id}
              sx={{
                display: 'flex',
                '& > *': {
                  width: '100%'
                }
              }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={post.imageUrl.startsWith('http') ? post.imageUrl : `${process.env.API_URL?.replace('/api', '')}${post.imageUrl}`}
                  alt={post.dishName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {post.dishName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '60px', flexGrow: 1 }}>
                    {post.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* Статистика */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                      <Typography variant="caption" color="text.secondary">
                        👁️ {post.views || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ❤️ {post.likes || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        💬 {post.comments || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        🔄 {post.reposts || 0}
                      </Typography>
                    </Box>
                    {/* Кнопки действий */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditStats(post)}
                        size="small"
                        title="Редактировать статистику"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleDownloadImage(post)}
                        size="small"
                        title="Скачать изображение"
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeletePost(post.id)}
                        size="small"
                        title="Удалить пост"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          </Grid>
        </Box>
      )}

          {posts.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Пока нет созданных постов
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Диалог редактирования статистики */}
      <Dialog open={openStatsDialog} onClose={() => setOpenStatsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать статистику поста</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedPost.dishName}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Лайки"
                    type="number"
                    value={statsForm.likes}
                    onChange={(e) => setStatsForm({ ...statsForm, likes: parseInt(e.target.value) || 0 })}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Просмотры"
                    type="number"
                    value={statsForm.views}
                    onChange={(e) => setStatsForm({ ...statsForm, views: parseInt(e.target.value) || 0 })}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Репосты"
                    type="number"
                    value={statsForm.reposts}
                    onChange={(e) => setStatsForm({ ...statsForm, reposts: parseInt(e.target.value) || 0 })}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Комментарии"
                    type="number"
                    value={statsForm.comments}
                    onChange={(e) => setStatsForm({ ...statsForm, comments: parseInt(e.target.value) || 0 })}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatsDialog(false)}>Отмена</Button>
          <Button onClick={handleSaveStats} variant="contained" disabled={loading}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог создания поста */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => {
          setOpenCreateDialog(false);
          setSelectedDishId('');
          setSelectedImageFile(null);
          setImagePreview(null);
          setUseAIGeneratedImage(true);
          setImagePrompt('');
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Создать новый пост</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <Select
              value={selectedDishId}
              onChange={(e) => setSelectedDishId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Выберите блюдо
              </MenuItem>
              {renderDishOptions()}
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Источник изображения:
            </Typography>
            <FormControl component="fieldset">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id="ai-image"
                    name="imageSource"
                    checked={useAIGeneratedImage && !selectedImageFile}
                    onChange={() => {
                      setUseAIGeneratedImage(true);
                      setSelectedImageFile(null);
                      setImagePreview(null);
                    }}
                  />
                  <label htmlFor="ai-image" style={{ marginLeft: 8 }}>
                    Сгенерировать через AI (Puter.js - Flux Schnell Free)
                  </label>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id="upload-image"
                    name="imageSource"
                    checked={!useAIGeneratedImage || !!selectedImageFile}
                    onChange={() => setUseAIGeneratedImage(false)}
                  />
                  <label htmlFor="upload-image" style={{ marginLeft: 8 }}>
                    Загрузить свое изображение
                  </label>
                </Box>
              </Box>
            </FormControl>
          </Box>

          {useAIGeneratedImage && !selectedImageFile && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Промпт для генерации изображения:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Введите описание изображения на английском языке..."
                helperText="Опишите, какое изображение вы хотите получить. Промпт будет автоматически переведен на английский, если нужно."
                sx={{ mb: 1 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={async () => {
                  if (selectedDishId) {
                    const selectedDish = Dishes.items?.find((d: DishesType) => d.id === selectedDishId);
                    if (selectedDish) {
                      try {
                        const initialPrompt = await generateInitialPrompt(selectedDish.name);
                        setImagePrompt(initialPrompt);
                      } catch (err) {
                        setError('Ошибка генерации промпта');
                      }
                    }
                  }
                }}
                disabled={!selectedDishId}
              >
                Сгенерировать промпт автоматически
              </Button>
            </Box>
          )}

          {(!useAIGeneratedImage || selectedImageFile) && (
            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageSelect}
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" fullWidth>
                  Выбрать изображение
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Отмена</Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!selectedDishId || loading || generatingImage}
          >
            {generatingImage ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Генерация изображения...
              </>
            ) : loading ? (
              <CircularProgress size={24} />
            ) : (
              'Создать'
            )}
          </Button>
        </DialogActions>
      </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;

