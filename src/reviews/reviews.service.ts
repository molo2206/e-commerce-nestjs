/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/users/utility/decorators/current-user-decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productsService: ProductsService
  ) { }
  async create(createReviewDto: CreateReviewDto, currentUser: UserEntity): Promise<ReviewEntity> {
    // Récupérer le produit associé à l'avis
    const product = await this.productsService.findOne(createReviewDto.productId);

    // Vérifier si l'utilisateur a déjà donné un avis pour ce produit
    let review = await this.findOneByUserAndProduct(currentUser.id, createReviewDto.productId);

    if (!review) {
      // Création d'un nouvel avis
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      // Mise à jour de l'avis existant
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }

    // Sauvegarder et retourner l'avis
    return await this.reviewRepository.save(review);
  }


  findAll() {
    return `This action returns all reviews`;
  }

  async findAllByProduct(id: string): Promise<ReviewEntity[]> {
    const product = await this.productsService.findOne(id);
    return await this.reviewRepository.find({
      where: { product: { id } },
      relations: {
        user: true,
        product: {
          categoryId: true
        }
      }
    })

  }
  async findOne(id: string): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          categoryId: true
        }
      }
    })
    if (!review) throw new NotFoundException('Review not found.');
    return review
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: string) {
    const review = await this.findOne(id);
    return this.reviewRepository.remove(review);
  }
  
  async findOneByUserAndProduct(userId: number, productId: string) {
    return await this.reviewRepository.findOne({
      where: {
        user: {
          id: userId
        },
        product: {
          id: productId
        },
      },
      relations: {
        user: true,
        product: {
          categoryId: true
        }
      }
    })
  }
}
