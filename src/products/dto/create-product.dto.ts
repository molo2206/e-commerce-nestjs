/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateProductDto {
    @IsNotEmpty({ message: 'title can not be blank.' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'description can not be emppty.' })
    @IsString()
    description: string;

    @IsNotEmpty({ message: 'price should not be empty' })
    // @IsNumber({ maxDecimalPlaces: 2 }, { message: 'price should be number & max decimal precission 2' })
    // @IsPositive({ message: 'price should be positive number' })
    price: number;

    @IsNotEmpty({ message: 'stock should not be empty' })
    // @IsNumber({}, { message: 'stock should be number' })
    // @Min(0, { message: 'stock can not be negative' })
    stock: number;

    @IsNotEmpty({ message: 'category can not be emppty.' })
    @IsString()
    category: string;


}
