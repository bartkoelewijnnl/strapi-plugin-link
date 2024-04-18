import { Strapi } from '@strapi/strapi';
import pluginPkg from '../package.json';
import pluginId from '../admin/src/pluginId';
import { setup } from './graphql';

const name = pluginPkg.strapi.name;

export default ({ strapi }: { strapi: Strapi }) => {
	setup({ strapi });
	strapi.customFields.register({
		name: name,
		plugin: pluginId,
		type: 'json',
	});
};
