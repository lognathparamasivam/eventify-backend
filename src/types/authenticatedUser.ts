export interface AuthenticatedUser {
    user_id: number;
    email: string;
    iat: number;
    exp: number;
}