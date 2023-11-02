import { Common, Entity, Schema, Strapi } from '@strapi/strapi';
import { ShadowTypes } from './crud';

export const getTypes = ({ shadowTypes, strapi, nexus }: { shadowTypes: ShadowTypes; strapi: Strapi; nexus: any }) => {
	const types = Object.values(shadowTypes).map((shadow) => {
		return nexus.extendType({
			type: shadow.globalId,
			// TODO: Auth(?).
			auth: false,
			definition: (t: any) => {
				shadow.fields.forEach((field) => {
					t.field(field, {
						type: 'Slug',
						resolve: (root: { id: number }) => {
							const slug: {
								id: Entity.ID;
								uid: Common.UID.ContentType;
								kind: Schema.ContentTypeKind;
								label: string;
							} | null = root[field];

							if (!slug) {
								return null;
							}

							return strapi.plugin('link').service('link').getSlug(slug);
						},
					});
				});
			},
		});
	});

	return [
		nexus.objectType({
			name: 'Slug',
			auth: false,
			definition(t: any) {
				t.nonNull.field('id', { type: 'ID' });
				t.nonNull.string('uid');
				t.nonNull.string('kind');
				t.string('label');
				t.string('slug');
			},
		}),
		...types,
	];
};
