import {
    Component,
    Input,
    inject,
    PLATFORM_ID,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsService, Comment } from './comments.service';
import { SnackBarService } from '../../../projects/ui/src/public-api';

@Component({
    selector: 'app-comments',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './comments.html',
    styleUrls: ['./comments.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Comments {
    private _animeId!: number;
    @Input() set animeId(value: number) {
        this._animeId = value;
        if (isPlatformBrowser(this.platformId)) {
            this.loadComments();
        }
    }
    get animeId(): number { return this._animeId; }

    comments: Comment[] = [];
    commentForm: FormGroup;
    isLoading = false;
    isSubmitting = false;
    errorMessage: string | null = null;
    expandedReplies: { [key: number]: boolean } = {};
    replyToId: number | null = null;
    charCount = 0;

    private platformId = inject(PLATFORM_ID);
    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private commentsService = inject(CommentsService);
    private snackBar = inject(SnackBarService);

    constructor() {
        this.commentForm = this.fb.group({
            content: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]]
        });

        this.commentForm.get('content')?.valueChanges.subscribe(val => {
            this.charCount = val?.length || 0;
            this.cdr.markForCheck();
        });
    }

    private async populateReplyCounts(comments: Comment[]): Promise<Comment[]> {
        return await Promise.all(comments.map(async (comment) => {
            try {
                const [resCount, userData] = await Promise.all([
                    this.commentsService.getCountReplies(comment.id),
                    this.commentsService.getAvatarAndName(comment.userId)
                ]);


                const count = resCount?.[0]?.replies_count ? parseInt(resCount[0].replies_count, 10) : 0;

                const res = {
                    ...comment,
                    replyCount: count,
                    nickName: userData[0].nickName || 'Anonymous',
                    avatarUrl: userData[0].avatarUrl,
                    replies: comment.replies || []
                };

                return res
            } catch (err) {
                console.error(`Error enriching comment ${comment.id}:`, err);
                return { ...comment, replyCount: 0, replies: comment.replies || [] };
            }
        }));
    }

    async loadComments() {
        if (!this.animeId || this.isLoading) return;
        try {
            this.isLoading = true;
            this.cdr.detectChanges();

            const data = await this.commentsService.getCommentsByAnimeId(this.animeId);

            const enrichedComments = await this.populateReplyCounts(data);

            const map = new Map<number, Comment>();
            enrichedComments.forEach(c => map.set(c.id, c));


            const tree: Comment[] = [];
            map.forEach(node => {
                if (node.parentId) {
                    const parent = map.get(node.parentId);
                    if (parent) {
                        parent.replies = [...(parent.replies || []), node];
                    }
                } else {
                    tree.push(node);
                }
            });

            this.comments = tree;
        } catch (error) {
            this.errorMessage = 'Error loading comments';
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    }

    async submitComment() {
        if (this.commentForm.invalid || this.isSubmitting) return;

        try {
            this.isSubmitting = true;
            this.cdr.detectChanges();

            const content = this.commentForm.get('content')?.value;
            const commentData = {
                animeId: Number(this.animeId),
                content,
                parentId: this.replyToId || undefined
            };

            const newComment = await this.commentsService.createComment(commentData);

            const userData = await this.commentsService.getAvatarAndName(newComment.userId);

            const freshComment: Comment = {
                ...newComment,
                nickName: userData[0].nickName || 'Anonymous',
                avatarUrl: userData[0].avatarUrl,
                createdAt: new Date(),
                replies: [],
                replyCount: 0
            };

            this.snackBar.open(
                'Comment added successfully',
                'OK',
                3000,
                'success'
            )

            if (this.replyToId) {
                this.comments = this.updateRepliesInList(this.comments, this.replyToId, freshComment);
                this.expandedReplies[this.replyToId] = true;
                this.replyToId = null;
            } else {
                this.comments = [freshComment, ...this.comments];
            }

            this.commentForm.reset();
        } catch (error) {
            this.errorMessage = "Error when posting";
        } finally {
            this.isSubmitting = false;
            this.cdr.detectChanges();
        }
    }

    private updateRepliesInList(list: Comment[], parentId: number, newReply: Comment): Comment[] {
        return list.map(c => {
            if (c.id === parentId) {
                return {
                    ...c,
                    replies: [...(c.replies || []), newReply],
                    replyCount: (c.replyCount || 0) + 1
                };
            }
            if (c.replies && c.replies.length > 0) {
                return { ...c, replies: this.updateRepliesInList(c.replies, parentId, newReply) };
            }
            return c;
        });
    }

    toggleReplies(commentId: number) {
        this.expandedReplies[commentId] = !this.expandedReplies[commentId];
        if (this.expandedReplies[commentId]) {
            this.loadReplies(commentId);
        }
        this.cdr.detectChanges();
    }

    async loadReplies(commentId: number) {
        try {
            const rawReplies = await this.commentsService.getRepliesOfComment(commentId);
            const enrichedReplies = await this.populateReplyCounts(rawReplies);

            const updateTree = (list: Comment[]): Comment[] => {
                return list.map(c => {
                    if (c.id === commentId) {
                        return { ...c, replies: enrichedReplies };
                    }
                    if (c.replies && c.replies.length > 0) {
                        return { ...c, replies: updateTree(c.replies) };
                    }
                    return c;
                });
            };

            this.comments = updateTree(this.comments);
            this.cdr.detectChanges();
        } catch (error) {
            console.error('Error loading replies:', error);
        }
    }

    setupReply(commentId: number) {
        this.replyToId = this.replyToId === commentId ? null : commentId;
        this.commentForm.reset();
        this.cdr.detectChanges();
    }

    get contentControl() { return this.commentForm.get('content'); }
}