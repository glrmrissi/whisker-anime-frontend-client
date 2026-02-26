import {
    Component,
    OnInit,
    Input,
    inject,
    PLATFORM_ID,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsService, Comment } from './comments.service';

@Component({
    selector: 'app-comments',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './comments.html',
    styleUrls: ['./comments.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Comments {
    @Input() set animeId(value: number) {
        this._animeId = value;
        if (isPlatformBrowser(this.platformId)) {
            this.loadComments();
        }
    }
    get animeId(): number { return this._animeId; }
    private _animeId!: number;

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

    constructor() {
        this.commentForm = this.fb.group({
            content: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]]
        });

        this.commentForm.get('content')?.valueChanges.subscribe(val => {
            this.charCount = val?.length || 0;
            this.cdr.markForCheck();
        });
    }

    async loadComments() {
        if (!this.animeId || this.isLoading) return;

        try {
            this.isLoading = true;
            this.cdr.detectChanges();

            const data: Comment[] = await this.commentsService.getCommentsByAnimeId(this.animeId);

            const map = new Map<number, Comment>();
            const tree: Comment[] = [];

            data.forEach(comment => {
                map.set(comment.id, { ...comment, replies: [] });
            });

            data.forEach(comment => {
                const node = map.get(comment.id)!;
                if (comment.parentId) {
                    const parent = map.get(comment.parentId);
                    if (parent) {
                        parent.replies!.push(node);
                    }
                } else {
                    tree.push(node);
                }
            });

            this.comments = tree;

        } catch (error) {
            this.errorMessage = 'Failed to load comments';
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    }

private addReplyToTree(list: Comment[], parentId: number, newReply: Comment): boolean {
    for (const comment of list) {
        if (comment.id === parentId) {
            comment.replies = [...(comment.replies || []), newReply];
            return true;
        }
        if (comment.replies && comment.replies.length > 0) {
            const found = this.addReplyToTree(comment.replies, parentId, newReply);
            if (found) return true;
        }
    }
    return false;
}

async submitComment() {
    if (this.commentForm.invalid || this.isSubmitting) return;

    try {
        this.isSubmitting = true;
        this.cdr.detectChanges();
        
        const content = this.commentForm.get('content')?.value;
        const commentData = {
            animeId: Number(this.animeId),
            content: content,
            parentId: this.replyToId || undefined
        };

        const newComment = await this.commentsService.createComment(commentData);
        const freshComment = { ...newComment, replies: [] };

        if (this.replyToId) {
            this.addReplyToTree(this.comments, this.replyToId, freshComment);
            this.expandedReplies[this.replyToId] = true;
            this.replyToId = null;
        } else {
            this.comments = [freshComment, ...this.comments];
        }

        this.commentForm.reset();
    } catch (error) {
        this.errorMessage = "Error posting comment.";
    } finally {
        this.isSubmitting = false;
        this.cdr.detectChanges();
    }
}

    setupReply(commentId: number) {
        this.replyToId = this.replyToId === commentId ? null : commentId;
        this.commentForm.reset();
        this.cdr.markForCheck();
    }

    toggleReplies(commentId: number) {
        this.expandedReplies[commentId] = !this.expandedReplies[commentId];
        if (this.expandedReplies[commentId]) {
            this.loadReplies(commentId);
        }
        this.cdr.markForCheck();
    }

    async loadReplies(commentId: number) {
        try {
            const replies = await this.commentsService.getRepliesOfComment(commentId);
            this.comments = this.comments.map(c =>
                c.id === commentId ? { ...c, replies: replies } : c
            );
            this.cdr.markForCheck();
        } catch (error) {
            console.error('Error loading replies:', error);
        }
    }

    get contentControl() { return this.commentForm.get('content'); }
}