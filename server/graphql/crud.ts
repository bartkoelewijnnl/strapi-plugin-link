import { Attribute, Common, Schema, Strapi } from '@strapi/strapi';

export type ShadowType = { fields: string[]; globalId: string };
export type ShadowTypes = { [uid: Common.UID.ContentType]: ShadowType };

export const getShadowTypes = ({ strapi }: { strapi: Strapi }): ShadowTypes => {
	const contentTypes = Object.entries<Schema.ContentType>(strapi.contentTypes as { [uid: string]: Schema.ContentType });
	const shadow = contentTypes.reduce<ShadowTypes>((a, [uid, value]) => {
		if (!uid.includes('api::')) {
			return a;
		}

		const fields = getFields(value.attributes);

		if (Boolean(fields.length)) {
			return {
				...a,
				[uid]: {
					fields: fields,
					globalId: value.globalId,
				},
			};
		}

		return a;
	}, {});

	return shadow;
};

export const getFields = (attributes: Schema.Attributes): string[] => {
	return Object.entries(attributes).reduce<string[]>((a, [field, attribute]) => {
		if (!attribute.hasOwnProperty('customField') && attribute.type !== 'json') {
			return a;
		}

		if ((attribute as Attribute.OfType<Attribute.Kind> & { customField: string }).customField === 'plugin::link.link') {
			return [...a, field];
		}

		return a;
	}, []);
};
