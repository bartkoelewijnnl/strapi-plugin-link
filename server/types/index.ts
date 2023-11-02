import { Entity, Common, Schema } from '@strapi/strapi';

export type Slug = {
	id: Entity.ID;
	slug: string;
	kind: Schema.ContentTypeKind;
	uid: Common.UID.ContentType;
};

export type SlugOptions = {
	uid: Common.UID.ContentType;
	kind: Schema.ContentTypeKind;
	prefix?: string;
	slug?: string;
} & (
	| {
			kind: 'singleType';
			slug: string;
	  }
	| {
			kind: 'collectionType';
			field: string;
	  }
);
