import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductRequest {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    price: number;

    constructor(name: string, description: string, stock: number, price: number) {
        this.name = name;
        this.description = description;
        this.stock = stock;
        this.price = price;
    }

}

export class UpdateProductRequest {
    name?: string;

    description?: string;

    stock?: number;

    @Min(1)
    price?: number;
}