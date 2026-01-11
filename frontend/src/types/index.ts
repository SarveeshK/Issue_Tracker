export interface IssueDto {
    issueId: number;
    issueTitle: string;
    issueDescription: string;
    issueType: string;
    statusName: string;
    priorityName: string;
    tasksCount: number;
    createdDate: string;
    createdByUserName: string;
    createdByCompanyName: string;
    assignedToUsers: string[];
}

export interface CreateIssueDto {
    issueTitle: string;
    issueDescription: string;
    issueType: string;
    priorityId: number;
}

export interface TaskDto {
    taskId: number;
    issueId: number;
    taskTitle: string;
    taskDescription: string;
    statusName: string;
    priorityName: string;
    assignedToName: string | null;
}

export interface CreateTaskDto {
    issueId: number;
    taskTitle: string;
    taskDescription: string;
    priorityId: number;
}

export interface CommentDto {
    commentId: number;
    taskId?: number;
    issueId?: number;
    userId: number;
    userName: string;
    commentText: string;
    parentCommentId: number | null;
    createdDate: string;
    replies: CommentDto[];
}

export interface CreateCommentDto {
    taskId?: number;
    issueId?: number;
    userId: number;
    commentText: string;
    parentCommentId?: number | null;
}
