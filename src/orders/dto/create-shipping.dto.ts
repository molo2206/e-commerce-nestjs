/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateShippingDto {
    @IsNotEmpty({ message: "Phone Can not be empty." })
    @IsString({ message: "Phone format should be string" })
    phone: string;
    @IsOptional()
    @IsNotEmpty({ message: "name Can not be empty." })
    name: string;
    @IsNotEmpty({ message: "city Can not be empty." })
    @IsString({ message: "city format should be string" })
    city: string;
    @IsNotEmpty({ message: "state Can not be empty." })
    @IsString({ message: "state format should be string" })
    state: string;
    @IsNotEmpty({ message: "Country Can not be empty." })
    @IsString({ message: "Country format should be string" })
    country: string;
}