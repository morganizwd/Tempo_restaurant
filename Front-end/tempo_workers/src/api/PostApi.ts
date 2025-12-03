import { client } from "./client";

export interface CreatePostDto {
  dishId: string;
  imageUrl?: string; // URL изображения (сгенерированного через Puter.js или загруженного)
}

export interface PostDto {
  id: string;
  dishName: string;
  text: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
  views: number;
  reposts: number;
  comments: number;
}

export interface UpdatePostStatsDto {
  likes?: number;
  views?: number;
  reposts?: number;
  comments?: number;
}

export const PostApi = {
  createPost: async (data: CreatePostDto, imageFile?: File): Promise<PostDto> => {
    // Всегда используем FormData для отправки
    const formData = new FormData();
    formData.append("dishId", data.dishId);
    
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    // Не указываем Content-Type явно - браузер сам установит правильный заголовок с boundary
    const response = await client.post("/Post", formData);
    return response.data;
  },

  getAllPosts: async (): Promise<PostDto[]> => {
    const response = await client.get("/Post");
    return response.data;
  },

  getPostById: async (id: string): Promise<PostDto> => {
    const response = await client.get(`/Post/${id}`);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await client.delete(`/Post/${id}`);
  },

  updatePostStats: async (id: string, stats: UpdatePostStatsDto): Promise<PostDto> => {
    const response = await client.put(`/Post/${id}/stats`, stats);
    return response.data;
  },
};

