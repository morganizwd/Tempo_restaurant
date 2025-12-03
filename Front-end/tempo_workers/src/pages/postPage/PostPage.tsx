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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import InstagramIcon from '@mui/icons-material/Instagram';
import { PostApi, PostDto, CreatePostDto } from '../../api/PostApi';
import { useGlobalStore } from '../../shared/state/globalStore';
import DishesType from '../../shared/types/dishes';
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
  const [aiModel, setAiModel] = useState<string>('dall-e-3');

  useEffect(() => {
    fetchDishes(1, 100);
    loadPosts();
  }, []);

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

  const generateImageWithPuter = async (dishName: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const prompt = `Beautiful professional food photography of ${dishName}, appetizing, high quality, restaurant style, Instagram worthy`;
      
      // Проверяем, что Puter.js загружен
      if (typeof window.puter === 'undefined' || !window.puter?.ai?.txt2img) {
        reject(new Error('Puter.js не загружен. Пожалуйста, обновите страницу.'));
        return;
      }

      const options: Puter.ai.Txt2ImgOptions = {
        model: aiModel,
      };

      // Добавляем quality только для моделей, которые его поддерживают
      if (aiModel === 'dall-e-3') {
        options.quality = 'hd';
      } else if (aiModel === 'gpt-image-1' || aiModel === 'gpt-image-1-mini') {
        options.quality = 'high';
      }
      
      window.puter.ai.txt2img(prompt, options)
        .then((imgElement: HTMLImageElement) => {
          // Конвертируем data URL в File для отправки на сервер
          if (imgElement.src.startsWith('data:')) {
            const file = dataURLtoFile(imgElement.src, `generated-${Date.now()}.png`);
            resolve(file);
          } else {
            // Если это обычный URL, создаем файл из него
            fetch(imgElement.src)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], `generated-${Date.now()}.png`, { type: blob.type });
                resolve(file);
              })
              .catch(err => reject(new Error(`Ошибка загрузки изображения: ${err.message}`)));
          }
        })
        .catch((err: any) => {
          reject(new Error(`Ошибка генерации изображения: ${err.message || 'Неизвестная ошибка'}`));
        });
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
        setGeneratingImage(true);
        try {
          const selectedDish = Dishes.items?.find((d: DishesType) => d.id === selectedDishId);
          if (selectedDish) {
            const generatedFile = await generateImageWithPuter(selectedDish.name);
            imageFileToSend = generatedFile;
            
            // Показываем превью
            const reader = new FileReader();
            reader.onloadend = () => {
              setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(generatedFile);
          }
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
      setAiModel('dall-e-3');
      
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && posts.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={post.imageUrl.startsWith('http') ? post.imageUrl : `${process.env.API_URL?.replace('/api', '')}${post.imageUrl}`}
                  alt={post.dishName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {post.dishName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '60px' }}>
                    {post.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {posts.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Пока нет созданных постов
          </Typography>
        </Box>
      )}

      {/* Диалог создания поста */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
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
                    Сгенерировать через AI (Puter.js)
                  </label>
                </Box>
                {useAIGeneratedImage && !selectedImageFile && (
                  <FormControl fullWidth sx={{ ml: 4, mt: 1 }}>
                    <Select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="dall-e-3">DALL-E 3 (HD)</MenuItem>
                      <MenuItem value="dall-e-2">DALL-E 2</MenuItem>
                      <MenuItem value="gpt-image-1">GPT Image 1</MenuItem>
                      <MenuItem value="gemini-2.5-flash-image-preview">Gemini 2.5 Flash</MenuItem>
                      <MenuItem value="black-forest-labs/FLUX.1-schnell">Flux.1 Schnell</MenuItem>
                      <MenuItem value="black-forest-labs/FLUX.1.1-pro">Flux 1.1 Pro</MenuItem>
                      <MenuItem value="stabilityai/stable-diffusion-3-medium">Stable Diffusion 3</MenuItem>
                    </Select>
                  </FormControl>
                )}
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
  );
};

export default PostPage;

