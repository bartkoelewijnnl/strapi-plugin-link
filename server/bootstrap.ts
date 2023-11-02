import { Strapi } from '@strapi/strapi';
import { setup } from './graphql';

export default ({ strapi }: { strapi: Strapi }) => {
	setup({ strapi });
};
