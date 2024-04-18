import { Common, Entity, Schema } from '@strapi/strapi';

export type LoadingModel<T> =
	| { data: T; loading: boolean; error: undefined }
	| { data: undefined; loading: true; error: undefined }
	| { data: undefined; loading: false; error: Error };

export type LinkValue =
	| {
			type: 'internal' | 'external';
			target: 'blank' | 'self';
			label: string;
	  } & (
			| {
					type: 'internal';
					link: LinkInternal;
			  }
			| {
					type: 'external';
					link: LinkExternal;
			  }
	  );

export type LinkInternal = {
	id: Entity.ID;
	uid: Common.UID.ContentType;
	kind: Schema.ContentTypeKind;
};

export type LinkExternal = string;

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T;
