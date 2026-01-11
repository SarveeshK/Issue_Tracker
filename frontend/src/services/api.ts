import axios from 'axios';
import type { CreateIssueDto, IssueDto, CreateTaskDto, TaskDto, CommentDto, CreateCommentDto } from '../types';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
});

export const issueService = {
    getAll: async (filters?: { search?: string; status?: string; priority?: string; type?: string }) => {
        const response = await api.get<IssueDto[]>('/issues', { params: filters });
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
    },
    getUsers: async () => {
        const response = await api.get<{ userId: number; name: string; email: string }[]>('/users');
        return response.data;
    },
    assignTask: async (taskId: number, userId: number) => {
        await api.put(`/tasks/${taskId}/assign`, { userId });
    },
    updateTaskStatus: async (taskId: number, status: string) => {
        await api.put(`/tasks/${taskId}/status`, { statusName: status });
    }
};
