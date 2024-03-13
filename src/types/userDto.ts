export interface CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl?: string;
    mobileNo?: string;
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    mobileNo?: string;
}