import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';

export interface Comment {
  id: number;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  userLiked: boolean;
  replies?: Comment[];
  parentId?: number;
  replyCount?: number; 
  avatarUrl?: string;
  nickName?: string; 
}

export interface CommentsDto {
  animeId: number;
  content: string;
  parentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(private apiService: ApiService) {}

  async createComment(commentsDto: CommentsDto): Promise<Comment> {
    console.log(commentsDto)
    return this.apiService.postV1<Comment>('comments', commentsDto);
  }

  async getCommentsByAnimeId(animeId: number): Promise<Comment[]> {
    return this.apiService.getV1<Comment[]>('comments', { animeId });
  }

  async getRepliesOfComment(commentId: number): Promise<Comment[]> {
    return this.apiService.getV1<Comment[]>('comments/replies', { commentId });
  }

  async likeComment(commentId: number): Promise<any> {
    return this.apiService.patchV1('comments/like', { commentId });
  }

  async getCountReplies(commentId: number) {
    return this.apiService.getV1('comments/count-replies', { commentId });
  }

  async getAvatarAndName(userId: string) {
    return this.apiService.getV1('users/avatar-name', { userId });
  }

  async getLikesByCommentId(commentId: number): Promise<{ likesCount: number }> {
    return this.apiService.getV1<{ likesCount: number }>('comments/count-likes', { commentId });
  }
}