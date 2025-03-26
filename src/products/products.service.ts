/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { title } from 'process';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService
  ) { }
  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(createProductDto.category);
    const product = this.productRepository.create(createProductDto)
    // const p = Object.assign(ProductEntity, createProductDto)
    product.categoryId = category;
    product.addedBy = currentUser
    return await this.productRepository.save(product)
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    const products = await this.productRepository.findOne({
      where: { id }, relations: {
        addedBy: true,
        categoryId: true
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true
        },
        categoryId: {
          id: true,
          title: true
        }
      }
    });
    if (!products) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      throw new NotFoundException(`Le produit avec l'ID ${id} n'existe pas.`);
    }
    return products
  }

  async update(
    id: string,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity
  ): Promise<ProductEntity> {
    // Trouver le produit existant
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }
    // Mettre à jour les champs du produit
    Object.assign(product, updateProductDto);
    product.addedBy = currentUser; // Mise à jour de l'utilisateur
    // Si la catégorie est mise à jour, récupérer l'entité correspondante
    if (updateProductDto.category) {
      const category = await this.categoryService.findOne(updateProductDto.category);
      if (!category) {
        throw new NotFoundException(`Catégorie avec l'ID ${updateProductDto.category} non trouvée`);
      }
      product.categoryId = category; // Assigner l'entité et non l'ID
    }
    // Sauvegarder et retourner le produit mis à jour
    return await this.productRepository.save(product);
  }


  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
