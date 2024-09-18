import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from 'src/app/interfaces/misc/comment';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { CommentService } from 'src/app/services/Comment/comment.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { CommentRequest } from 'src/app/interfaces/requests/comment-request';
import { UrlPipe } from '../../pipes/url.pipe';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    DividerModule,
    ButtonModule,
    InputTextareaModule,
    FormsModule,
    PaginatorModule,
    UrlPipe
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CommentsComponent implements OnInit {
  comment: string = '';
  comments: Comment[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  loading: boolean = false;

  @Input({ required: true }) programId!: string;

  constructor(private commentService: CommentService) {}

  async ngOnInit() {
    await this.loadComments();
    await this.goToLastPage();
  }

  async loadComments() {
    const params: CommentRequest = {
      page: this.first / this.rows,
      size: this.rows,
      programId: this.programId
    };

    try {
      this.loading = true;
      const response = await this.commentService.getComments(params);
      this.comments = response.content;
      this.totalRecords = response.totalElements;
    } finally {
      this.loading = false;
    }
  }

  async goToLastPage() {
    const totalPages = Math.ceil(this.totalRecords / this.rows);
    if (totalPages > 0) {
      this.first = (totalPages - 1) * this.rows; // set the first to the last page
      await this.loadComments();
    }
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.loadComments();
  }

  async createComment() {
    this.loading = true;
    try {
      await this.commentService.createComment(this.comment, this.programId);
      this.comment = '';
      await this.loadComments();
      await this.goToLastPage();
    } finally {
      this.loading = false;
    }
  }
}
