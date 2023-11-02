import { Common, Schema, Strapi } from '@strapi/strapi';

export type ShadowType = { fields: string[]; globalId: string };
export type ShadowTypes = { [uid: Common.UID.ContentType]: ShadowType };
export type UIDSchema = {
	[uid: string]: Schema.ContentType | Schema.Component;
};

export const getShadowTypes = ({ strapi }: { strapi: Strapi }): ShadowTypes => {
	const components = Object.entries(strapi.components as UIDSchema);
	const contentTypes = Object.entries(strapi.contentTypes as UIDSchema);

	const shadow = [...components, ...contentTypes].reduce<ShadowTypes>((a, [uid, value]) => {
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

		if (attribute['customField'] === 'plugin::link.link') {
			return [...a, field];
		}

		return a;
	}, []);
};
