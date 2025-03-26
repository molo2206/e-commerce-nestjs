/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateReviewDto {
    @IsNotEmpty({ message: 'Product should not be empty.' })
    productId: string;
    @IsNotEmpty({ message: 'retings could not be empty.' })
    @IsNumber({}, { message: 'retings Id should not be ' })
    ratings: number;
    @IsNotEmpty({ message: 'comment should not be empty.' })
    @IsString()
    comment: string;
}
