import { TRPCError } from '@trpc/server'
import { string, z } from 'zod'
import { createRouter } from '../createRouter'
import checkCreatorAuth from './checkCreatorAuth'
import getDiscordID, { getDiscordConnections } from './fetchDiscordId'

export const router = createRouter()
	.query('next-auth.getSession', {
		async resolve({ ctx }) {
			return ctx.session
		},
	})
	.query('next-auth.getDiscord', {
		input: z.object({
			key: z.unknown().optional(),
		}),
		async resolve({ input }) {
			return await getDiscordID(input.key)
		},
	})
	.query('next-auth.getDiscordConnections', {
		input: z.object({
			key: z.unknown().optional(),
		}),
		async resolve({ input }) {
			return await getDiscordConnections(input.key)
		},
	})
	.middleware(async ({ ctx, next }) => {
		if (!ctx.session) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'You must be logged in to access this resource.',
			})
		}
		return next()
	})
	.query('next-auth.getSecretCode', {
		async resolve() {
			const secretCode = process.env.NEXTAUTH_SECRET
			return secretCode
		},
	})
	.query('next-auth.checkCreator', {
		input: z.object({
			email: string(),
		}),
		async resolve({ input }) {
			return await checkCreatorAuth(input.email)
		},
	})
