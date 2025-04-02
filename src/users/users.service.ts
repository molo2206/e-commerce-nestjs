/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt } from 'crypto';
import { UserEntity } from './entities/user.entity';
import { OtpEntity } from 'src/otp/entities/otp.entity';
import { UserSignUpDto } from './dto/user-signup.dbo';
import { UserSignInDto } from './dto/user-signin.dbo';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
  ) { }

  async signup(UserSignUpDto: UserSignUpDto): Promise<any> {
    const userExists = await this.usersRepository.findOne({ where: { email: UserSignUpDto.email } });

    if (userExists) {
      throw new BadRequestException('Un compte avec cet email existe déjà.');
    }

    if (!UserSignUpDto.otpCode) {
      return await this.sendOtp(UserSignUpDto.email);
    }

    const otpEntry = await this.otpRepository.findOne({ where: { email: UserSignUpDto.email, otp: UserSignUpDto.otpCode } });

    if (!otpEntry || new Date() > otpEntry.expiresAt) {
      throw new BadRequestException('OTP invalide ou expiré.');
    }

    await this.otpRepository.delete({ email: UserSignUpDto.email });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    UserSignUpDto.password = await bcrypt.hash(UserSignUpDto.password, 10);
    const roles = Array.isArray(UserSignUpDto.roles) ? UserSignUpDto.roles : ['user'];

    const user = this.usersRepository.create({ ...UserSignUpDto, roles });
    await this.usersRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async sendOtp(email: string) {
    const otp = randomInt(100000, 999999).toString();
    await this.otpRepository.delete({ email });

    await this.otpRepository.save({ email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Votre code de vérification',
      text: `Votre code OTP est : ${otp}. Il est valide pour 10 minutes.`,
    });

    return { message: 'Un OTP a été envoyé à votre email. Veuillez le vérifier.' };
  }

  async signin(UserSignInDto: UserSignInDto) {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .leftJoinAndSelect('users.affectations', 'affectations') // ✅ Récupère les affectations
      .leftJoinAndSelect('affectations.organisation', 'organisation') // ✅ Récupère l'organisation de chaque affectation
      .leftJoinAndSelect('affectations.permissions', 'userPermissions') // ✅ Récupère les permissions liées aux affectations
      .leftJoinAndSelect('userPermissions.permission', 'permissions') // ✅ Récupère les détails des permissions
      .where('users.email = :email', { email: UserSignInDto.email })
      .getOne();

    if (!user) throw new UnauthorizedException('Invalid credentials.');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(UserSignInDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials.');

    const token = await this.accessToken(user);

    // Supprime le mot de passe avant de renvoyer la réponse
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,

      access_token: token
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async accessToken(user: UserEntity) {
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    if (!secretKey) throw new Error('Clé secrète JWT manquante');
    return sign({ id: user.id, email: user.email, roles: user.roles }, secretKey, { expiresIn: '30m' });
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { message: `User #${id} removed.` };
  }

}
