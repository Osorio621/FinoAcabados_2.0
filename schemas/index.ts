import * as z from "zod"

export const loginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    })
})

export const registerSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    confirmPassword: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    name: z.string().min(1, {
        message: "Name is required"
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
})

export const resetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
})

export const newPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
})

export const productSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    description: z.string().min(1, { message: "La descripción es requerida" }),
    price: z.string().min(1, { message: "El precio es requerido" }),
    stock: z.string().min(1, { message: "El stock es requerido" }),
    categoryId: z.string().min(1, { message: "La categoría es requerida" }),
    imageUrl: z.string().optional(),
    isOffer: z.boolean().default(false).optional(),
    discountPrice: z.string().optional(),
})
