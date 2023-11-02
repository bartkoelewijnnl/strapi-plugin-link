import { Strapi } from '@strapi/strapi';
import { getShadowTypes } from './crud';
import { getTypes } from './types';

export const setup = ({ strapi }: { strapi: Strapi }) => {
	// TODO: check if GraphQL is enabled.
	const extensionService = strapi.plugin('graphql').service('extension');
	const shadowTypes = getShadowTypes({ strapi });

	// Disable link fields.
	Object.entries(shadowTypes).forEach(([uid, shadow]) => {
		shadow.fields.forEach((field) => {
			extensionService.shadowCRUD(uid).field(field).disable();
		});
	});

	const extension = ({ nexus }) => {
		const types = getTypes({ shadowTypes, strapi, nexus });

		return {
			types,
		};
	};

	extensionService.use(extension);
};
