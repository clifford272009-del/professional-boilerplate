import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { NotFoundError, ConflictError } from '../utils/errors';
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

interface FindAllOptions {
  page: number;
  limit: number;
  sort: string;
  order: 'ASC' | 'DESC';
}

const ALLOWED_SORT_FIELDS = new Set(['id', 'name', 'email', 'createdAt', 'updatedAt']);

export class UserService {
  static async findAll(options: FindAllOptions): Promise<[User[], number]> {
    const { page, limit, sort, order } = options;
    const skip = (page - 1) * limit;
    const safeSort = ALLOWED_SORT_FIELDS.has(sort) ? sort : 'createdAt';

    return userRepository.findAndCount({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
      order: { [safeSort]: order },
      skip,
      take: limit,
    });
  }

  static async findById(id: string): Promise<User> {
    const user = await userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return user;
  }

  static async create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const normalizedEmail = data.email.trim().toLowerCase();

    const existing = await userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = userRepository.create({
      ...data,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await userRepository.save(user);
    const { password: _password, ...safeUser } = savedUser as User & {
      password?: string;
    };

    return safeUser as User;
  }

  static async update(id: string, data: Partial<User>): Promise<User> {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    const updateData: Partial<User> = { ...data };
    delete (updateData as { password?: string }).password;

    if (updateData.email) {
      const normalizedEmail = updateData.email.trim().toLowerCase();
      updateData.email = normalizedEmail;

      if (normalizedEmail !== user.email) {
        const existing = await userRepository.findOne({
          where: { email: normalizedEmail },
        });

        if (existing) {
          throw new ConflictError('A user with this email already exists');
        }
      }
    }

    Object.assign(user, updateData);

    const updatedUser = await userRepository.save(user);
    const { password: _password, ...safeUser } = updatedUser as User & {
      password?: string;
    };

    return safeUser as User;
  }

  static async delete(id: string): Promise<void> {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    await userRepository.remove(user);
  }
}