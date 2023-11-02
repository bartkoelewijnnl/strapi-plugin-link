import { Strapi } from '@strapi/strapi';
import pluginPkg from '../package.json';
import pluginId from '../admin/src/pluginId';

const name = pluginPkg.strapi.name;

export default ({ strapi }: { strapi: Strapi }) => {
	strapi.customFields.register({
		name: name,
		plugin: pluginId,
		type: 'json',
	});
};
