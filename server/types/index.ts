import { Entity, Common, Schema } from '@strapi/strapi';

export type Slug = {
	id: Entity.ID;
	slug: string;
	kind: Schema.ContentTypeKind;
	uid: Common.UID.ContentType;
};

export type Setting = {
	prefix?: string;
	kind: Schema.ContentTypeKind;
	enabled?: boolean;
} & (SettingSingleType | SettingCollectionType);

export type SettingSingleType = {
	kind: 'singleType';
	slug: string;
};

export type SettingCollectionType = {
	kind: 'collectionType';

	// Possible slug attributes.
	attributes: string[];
	attribute?: string;
};

export interface Settings {
	[uid: Common.UID.ContentType]: Setting;
}
