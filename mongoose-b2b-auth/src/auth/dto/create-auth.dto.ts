import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, {message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character and should be of at least 6 characters'})
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}
