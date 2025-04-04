/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthentificationGuard } from 'src/users/utility/guards/authentification.guard';
import { AuthorizeGuard } from 'src/users/utility/guards/authorization.guard';
import { Roles } from 'src/users/utility/common/user-roles.enum';
import { CurrentUser } from 'src/users/utility/decorators/current-user-decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CheckPermission } from 'src/users/utility/decorators/permission.decorator';
import { PermissionsGuard } from 'src/users/utility/guards/permissions.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @UseGuards(PermissionsGuard)
  @CheckPermission('products', 'read')
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, {  // Permet l'upload de 5 images max
    storage: diskStorage({
      destination: './uploads', // Dossier de stockage
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        callback(null, uniqueSuffix + '-' + file.originalname); // Génération du nom de fichier unique
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // Limite de taille par fichier à 5MB
    },
  }))
  async create(
    @Body() createProductDto: CreateProductDto,  // Dto pour la création du produit
    @CurrentUser() currentUser: UserEntity,      // Utilisateur courant
    @UploadedFiles() files: Express.Multer.File[], // Récupération des fichiers uploadés
  ): Promise<any> {
    try {
      // Appel au service pour créer le produit et gérer les fichiers
      return await this.productsService.create(createProductDto, currentUser, files);
    } catch (error) {
      // Gestion des erreurs, si une erreur survient, on renvoie un message d'erreur
      return {
        statusCode: 500,
        message: 'An error occurred while creating the product',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error: error.message,
      };
    }
  }

  @Get()
  async findAll(@Query() query: any): Promise<any> {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    return await this.productsService.findOne(id);
  }

  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser()
  CurrentUser: UserEntity
  ) {
    return await this.productsService.update(id, updateProductDto, CurrentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
