/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

/* eslint-disable prettier/prettier */
export class OrderedProductsDto {
    @IsNotEmpty({ message: "Product can not be empty" })
    id: string;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price should be number & max decimal precission 2" })
    @IsPositive({ message: "Price can not be negative" })
    product_unit_price: number;

    @IsNumber({}, { message: "Quantity should be number & max decimal precission 2" })
    @IsPositive({ message: "Quantity can not be negative" })
    product_quantity: number;
}