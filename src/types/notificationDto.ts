export interface CreateNotificationDto {
    message: string;
    userId: number;
    read?: number;
}

export interface UpdateNotificationDto {
    message: string;
    read?: number;
}