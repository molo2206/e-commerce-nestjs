/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dbo';
import { UserSignInDto } from './dto/user-signin.dbo';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt } from 'crypto';
import { OtpEntity } from 'src/otp/entities/otp.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    @InjectRepository(OtpEntity) // ✅ Vérifie bien cette injection
    private readonly otpRepository: Repository<OtpEntity>,
  ) { }

  async signup(UserSignUpDto: UserSignUpDto): Promise<any> {
    // Vérifie si l'utilisateur existe déjà
    const userExists = await this.usersRepository.findOne({ where: { email: UserSignUpDto.email } });

    if (userExists) {
      throw new BadRequestException('Un compte avec cet email existe déjà.');
    }

    // Si aucun OTP n'est fourni, on génère et envoie un OTP
    if (!UserSignUpDto.otpCode) {
      const otp = randomInt(100000, 999999).toString();

      // Supprimer les OTPs existants pour cet email AVANT d'en générer un nouveau
      await this.otpRepository.delete({ email: UserSignUpDto.email });

      // Enregistrement du nouvel OTP
      await this.otpRepository.save({
        email: UserSignUpDto.email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Expire en 10 min
      });

      // Envoi de l'OTP par e-mail
      await this.mailerService.sendMail({
        to: UserSignUpDto.email,
        subject: 'Votre code de vérification',
        text: `Votre code OTP est : ${otp}. Il est valide pour 10 minutes.`,
      });

      return { message: 'Un OTP a été envoyé à votre email. Veuillez le vérifier pour continuer.' };
    }

    // Si un OTP est fourni, on vérifie s'il est valide
    const otpEntry = await this.otpRepository.findOne({ where: { email: UserSignUpDto.email, otp: UserSignUpDto.otpCode } });

    // Vérifier si l'OTP est valide ou expiré
    if (!otpEntry || new Date() > otpEntry.expiresAt) {
      throw new BadRequestException('OTP invalide ou expiré.');
    }

    // Supprimer l’OTP après utilisation
    await this.otpRepository.delete({ email: UserSignUpDto.email });

    // Hash du mot de passe avant stockage
    UserSignUpDto.password = await bcrypt.hash(UserSignUpDto.password, 10);

    // Définition des rôles
    const roles = UserSignUpDto.roles && Array.isArray(UserSignUpDto.roles) ? UserSignUpDto.roles : ['user'];

    // Création et sauvegarde de l'utilisateur
    const user = this.usersRepository.create({ ...UserSignUpDto, roles });
    await this.usersRepository.save(user);

    // Supprime le mot de passe avant de retourner l’objet utilisateur
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }



  async signin(UserSignInDto: UserSignInDto) {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: UserSignInDto.email })
      .getOne();
    if (!userExists) throw new BadRequestException('Bad creadentials.');
    const matchPassword = await bcrypt.compare(
      UserSignInDto.password,
      userExists.password,
    );
    if (!matchPassword) throw new BadRequestException('Bad creadentials.');
    const { password, ...userWithoutPassword } = userExists; // Supprime proprement le mot de passe
    return userWithoutPassword;
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(UserSignInDto: { email: string; password: string }) {
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY as string;
    if (!secretKey) throw new Error('Clé secrète JWT manquante');
    // Récupérer l'utilisateur depuis la base de données
    const user = await this.usersRepository.findOne({ where: { email: UserSignInDto.email } });
    if (!user) throw new Error('Utilisateur introuvable');
    const expiresIn = '30m';
    return sign(
      { id: user.id, email: user.email },
      secretKey,
      { expiresIn }
    );
  }
  // async sendOtp(email: string) {
  //   const otp = randomInt(100000, 999999).toString();
  //   const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expire en 10 min

  //   await this.otpRepository.save(email, otp, expiresAt);

  //   // Envoyer l'OTP par email ici...
  // }
  // async verifyAndSignup(email: string, otpCode: string) {
  //   const isValid = await this.otpRepository.verifyOtp(email, otpCode);

  //   if (!isValid) {
  //     throw new BadRequestException('OTP invalide ou expiré.');
  //   }

  //   // Continuer avec la création du compte utilisateur...
  // }
}
