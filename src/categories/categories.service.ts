/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(createCategoryDto: CreateCategoryDto, CurrentUser: UserEntity): Promise<CategoryEntity> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/await-thenable
    // Vérifier si une catégorie avec le même titre existe déjà
    const existingCategory = await this.categoryRepository.findOne({
      where: { title: createCategoryDto.title },
    });

    if (existingCategory) {
      throw new BadRequestException('Une catégorie avec ce titre existe déjà.');
    }

    // Création de la nouvelle catégorie
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      addedBy: CurrentUser,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({ relations: ['addedBy'] });
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id }, relations: ['addedBy'],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        }
      }
    });
    if (!category) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      throw new NotFoundException(`La catégorie avec l'ID ${id} n'existe pas.`);
    }
    return category;
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: string, fields: Partial<UpdateCategoryDto>): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found.');
    Object.assign(category, fields)
    return await this.categoryRepository.save(category);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
