import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
}).min(1);

export const idParamSchema = Joi.object({
    id: Joi.string().uuid().required(),
});

export const paginationQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('createdAt'),
    order: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
});