/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Brackets, Like, Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { title } from 'process';
import { OrderStatus } from 'src/orders/enums/order-status-enum';
import dataSource from 'db/data-source';
import { ImageEntity } from './entities/image.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly categoryService: CategoriesService

  ) { }

  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
    files?: Express.Multer.File[],
  ): Promise<any> {
    try {
      //Vérifier si le produit existe déjà (pour mise à jour)
      let product = await this.productRepository.findOne({
        where: { title: createProductDto.title },
        relations: ['images'],
      });

      // Si le produit existe, supprimer les anciennes images
      if (product && product.images && product.images.length > 0) {
        for (const image of product.images) {
          try {
            // ✅ Construction du chemin absolu correct
            const imagePath = path.resolve('uploads', path.basename(image.url));

            // ✅ Vérification de l'existence avant suppression
            if (fs.existsSync(imagePath)) {
              await fs.promises.unlink(imagePath);
              // console.log(`Image supprimée : ${imagePath}`);
            } else {
              console.warn(`Fichier introuvable : ${imagePath}`);
            }
          } catch (error) {
            console.error(`Erreur suppression de ${image.url}:`, error);
          }
        }

        //Suppression des entrées en base de données après suppression physique
        await this.imageRepository.remove(product.images);
        product.images = [];
      }

      // Si le produit n'existe pas encore, création
      if (!product) {
        product = this.productRepository.create(createProductDto);
        product.addedBy = currentUser;
        product = await this.productRepository.save(product);
      }

      // Ajout des nouvelles images si présentes
      if (files && files.length > 0) {
        const newImages = files.map(file => {
          const image = new ImageEntity();
          image.url = `/uploads/${file.filename}`;
          image.product = product;
          return image;
        });

        await this.imageRepository.save(newImages);
        product.images = newImages;
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Produit créé/modifié avec succès, images mises à jour',
      };
    } catch (error) {
      // console.error(`Erreur lors de la création du produit :`, error);
      throw new HttpException(
        { message: 'Erreur lors de la création du produit', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: any): Promise<any> {
    const limit = query.limit ? parseInt(query.limit, 10) : 4;
    const page = query.page ? parseInt(query.page, 10) : 1;
    const skip = (page - 1) * limit;
    const search = query.search ? query.search.trim().toLowerCase() : '';
    const category = query.category ? query.category.trim().toLowerCase() : '';

    const queryBuilder = dataSource.getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categoryId', 'category')
      .leftJoinAndSelect('product.reviews', 'review')
      .leftJoinAndSelect('product.images', 'image') // Assurer que les images sont jointes
      .addSelect([
        'COUNT(review.id) AS reviewCount',
        'AVG(review.ratings) AS avgRating'
      ])
      .groupBy('product.id, category.id')
      .skip(skip)
      .take(limit);

    if (search) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('LOWER(product.title) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(product.description) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(category.title) LIKE :search', { search: `%${search}%` });
        })
      );
    }

    const [products, totalProducts] = await Promise.all([
      queryBuilder.getMany(),  // Utiliser getMany() pour récupérer les relations
      queryBuilder.getCount()
    ]);

    // Formater les produits et ajouter les URLs des images
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images.map(image => image.url), // Récupérer toutes les URLs des images
    }));

    return {
      total: totalProducts,
      products: formattedProducts,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalProducts / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        addedBy: true,
        categoryId: true,
        images: true, // Ajouter la relation images
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        categoryId: {
          id: true,
          title: true,
        },
        images: {
          id: true,
          url: true, // Sélectionner uniquement l'URL de l'image
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Le produit avec l'ID ${id} n'existe pas.`);
    }

    return product;
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

  async updateStock(id: string, stock: number, status: string) {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED) {
      product.stock -= stock;
    } else {
      product.stock += stock;
    }
    product = await this.productRepository.save(product)
    return product;
  }
}
