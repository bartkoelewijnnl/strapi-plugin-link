import { Strapi, Attribute, Schema, Common, Entity } from '@strapi/strapi';
import type { Slug, SlugOptions } from '../types';
import path from 'path';

// TODO: from options.
const LEADING_SLASH = true;

const getSlug = (...args: (string | undefined)[]): string => {
	const paths = [LEADING_SLASH && '/', ...args].filter(Boolean) as string[];
	return path.join(...paths);
};

const getEntries = async (uid: Common.UID.ContentType, field?: string): Promise<Attribute.GetValues<Common.UID.Schema>[]> => {
	const fields = field ? [field] : undefined;
	const entries = (await strapi.entityService.findMany(uid, { fields })) ?? [];

	return Array.isArray(entries) ? entries : [entries];
};

export default ({ strapi }: { strapi: Strapi }) => ({
	async getContentTypes(): Promise<Schema.ContentType[]> {
		const contentTypes = Object.entries(strapi.contentTypes as { [uid: string]: Schema.ContentType });

		return contentTypes.reduce<Schema.ContentType[]>((a, [uid, value]) => {
			if (!uid.includes('api::')) {
				return a;
			}

			if (value.kind === 'collectionType' && Object.keys(value.attributes).includes('slug') && value.attributes['slug'].type === 'string') {
				return [...a, value];
			} else if (value.kind === 'singleType') {
				return [...a, value];
			}

			return a;
		}, []);
	},
	async getSlug(slug: Omit<Slug, 'slug'>, field?: string): Promise<Slug | null> {
		if (slug.kind === 'singleType') {
			return { ...slug, slug: getSlug('todo') };
		}

		const entry = await strapi.entityService?.findOne(slug.uid, slug.id, {
			// TODO make modular.
			fields: ['slug'],
		});

		return entry ? { ...slug, slug: getSlug(entry['slug']) } : null;
	},
	async getSlugs(options: SlugOptions): Promise<Slug[]> {
		if (options.kind === 'singleType') {
			const entries = await getEntries(options.uid);
			const slugs = entries.map((entry) => ({
				id: entry.id,
				uid: options.uid,
				kind: options.kind,
				slug: getSlug(options.slug),
			}));

			return slugs;
		}

		if (options.kind === 'collectionType') {
			const entries = await getEntries(options.uid, options.field);

			const slugs = entries.map((entry) => ({
				id: entry.id,
				uid: options.uid,
				kind: options.kind,
				slug: getSlug(options.prefix, entry[options.field]),
			}));

			return slugs;
		}

		return [];
	},
});
