import axios from 'axios';
import type { CreateIssueDto, IssueDto, CreateTaskDto, TaskDto, CommentDto, CreateCommentDto } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const issueService = {
    getAll: async () => {
        const response = await api.get<IssueDto[]>('/issues');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<IssueDto>(`/issues/${id}`);
        return response.data;
    },
    create: async (data: CreateIssueDto) => {
        const response = await api.post<IssueDto>('/issues', data);
        return response.data;
    },
    close: async (id: number) => {
        await api.put(`/issues/${id}/close`);
    },
    getTasks: async (issueId: number) => {
        const response = await api.get<TaskDto[]>(`/tasks/issue/${issueId}`);
        return response.data;
    },
    createTask: async (data: CreateTaskDto) => {
        const response = await api.post<TaskDto>('/tasks', data);
        return response.data;
    },
    getTaskById: async (taskId: number) => {
        const response = await api.get<TaskDto>(`/tasks/${taskId}`);
        return response.data;
    },
    getComments: async (taskId: number) => {
        const response = await api.get<CommentDto[]>(`/comments/task/${taskId}`);
        return response.data;
    },
    createComment: async (data: CreateCommentDto) => {
        const response = await api.post<CommentDto>('/comments', data);
        return response.data;
    }
};
