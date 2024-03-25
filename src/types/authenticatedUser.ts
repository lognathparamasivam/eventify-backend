export interface AuthenticatedUser extends Express.User {
    user_id: number;
    email: string;
    iat: number;
    exp: number;
    accessToken: string;
    refreshToken: string;
}