export interface IssueDto {
    issueId: number;
    issueTitle: string;
    issueDescription: string;
    issueType: string;
    statusName: string;
    tasksCount: number;
    createdDate: string;
}

export interface CreateIssueDto {
    issueTitle: string;
    issueDescription: string;
    issueType: string;
}

export interface TaskDto {
    taskId: number;
    issueId: number;
    taskTitle: string;
    taskDescription: string;
    statusName: string;
    assignedToName: string | null;
}

export interface CreateTaskDto {
    issueId: number;
    taskTitle: string;
    taskDescription: string;
}

export interface CommentDto {
    commentId: number;
    taskId: number;
    userId: number;
    userName: string;
    commentText: string;
    parentCommentId: number | null;
    createdDate: string;
    replies: CommentDto[];
}

export interface CreateCommentDto {
    taskId: number;
    userId: number;
    commentText: string;
    parentCommentId: number | null;
}
