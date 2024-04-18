import { Strapi, Attribute, Schema, Common, Entity } from '@strapi/strapi';
import type { Setting, SettingCollectionType, SettingSingleType, Settings, Slug } from '../types';
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
	getContentTypes(): Schema.ContentType[] {
		const contentTypes = Object.entries(strapi.contentTypes as { [uid: string]: Schema.ContentType });

		return contentTypes.reduce<Schema.ContentType[]>((a, [uid, value]) => {
			if (!uid.includes('api::')) {
				return a;
			}

			return [...a, value];
		}, []);
	},
	async getSlug(slug: Omit<Slug, 'slug'>): Promise<Slug | null> {
		const settings: Settings = await strapi.plugin('link').service('settings').getSettings();

		strapi.log.info(JSON.stringify(slug));
		if (settings[slug.uid] === undefined || settings[slug.uid].enabled !== true) {
			return null;
		}

		if (slug.kind === 'singleType') {
			const href = (settings[slug.uid] as SettingSingleType).slug;
			return { ...slug, slug: getSlug(href) };
		}

		if (slug.kind === 'collectionType') {
			const attribute = (settings[slug.uid] as SettingCollectionType).attribute;

			if (!attribute) {
				return null;
			}

			const entry = await strapi.entityService?.findOne(slug.uid, slug.id, {
				fields: [attribute],
			});

			return entry ? { ...slug, slug: getSlug(entry[attribute]) } : null;
		}

		return null;

		// const entry = await strapi.entityService?.findOne(slug.uid, slug.id, {
		// 	// TODO make modular.
		// 	fields: ['slug'],
		// });

		// return entry ? { ...slug, slug: getSlug(entry['slug']) } : null;
	},
	getSlugAttributes(uid: Common.UID.ContentType): string[] {
		const contentType = strapi.contentTypes[uid];

		if (!contentType) {
			return [];
		}

		return Object.entries(contentType.attributes).reduce<string[]>((a, [key, value]) => {
			if (['string', 'uid'].includes(value.type)) {
				return [...a, key];
			}

			return a;
		}, []);
	},
	async getSlugs(options: { uid: Common.UID.ContentType; kind: Schema.ContentTypeKind }): Promise<Slug[]> {
		const settings: Settings = await strapi.plugin('link').service('settings').getSettings();

		if (options.kind === 'singleType') {
			const slug = (settings[options.uid] as SettingSingleType).slug;
			const entries = await getEntries(options.uid);
			const slugs = entries.map((entry) => ({
				id: entry.id,
				uid: options.uid,
				kind: options.kind,
				slug: getSlug(slug),
			}));

			return slugs;
		}

		if (options.kind === 'collectionType') {
			const setting = settings[options.uid] as Setting & SettingCollectionType;
			const attribute = setting.attribute;

			if (!attribute || !setting.enabled) {
				return [];
			}

			const entries = await getEntries(options.uid, attribute);
			const slugs = entries.map((entry) => ({
				id: entry.id,
				uid: options.uid,
				kind: options.kind,
				slug: getSlug(entry[attribute]),
			}));

			return slugs;
		}

		return [];
	},
});
