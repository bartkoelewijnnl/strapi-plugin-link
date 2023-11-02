import { Common, Entity, Schema } from '@strapi/strapi';

export type LoadingModel<T> =
	| { data: T; loading: false; error: undefined }
	| { data: undefined; loading: true; error: undefined }
	| { data: undefined; loading: false; error: Error };

export type LinkValue = {
	uid: Common.UID.ContentType;
	id: Entity.ID;
	kind: Schema.ContentTypeKind;
	label: string;
} | null;
