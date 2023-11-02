import React, { PropsWithChildren, useMemo } from 'react';
import { Common, Entity, Schema } from '@strapi/strapi';
import { Select, Option, Flex, Box, Badge, Link, GridLayout } from '@strapi/design-system';
import useApi from '../../hooks/useApi';
import { LinkValue } from '../../types';

interface ComboboxSlugsProps {
	value: { uid: Common.UID.ContentType; kind: Schema.ContentTypeKind; id?: Entity.ID };
	onChange: (id: Entity.ID) => void;
}

const ComboboxSlugs = ({ value, onChange }: ComboboxSlugsProps) => {
	const { fetchSlugs } = useApi();
	// TODO: error.
	const {
		data: slugs = [],
		error,
		loading,
	} = fetchSlugs(
		value.kind === 'singleType'
			? {
				slug: 'hometodo',
				kind: 'singleType',
				uid: value.uid,
			  }
			: {
				kind: 'collectionType',
				uid: value.uid,
				field: 'slug',
			  },
	);

	const slug = useMemo(() => slugs.find((slug) => slug.id == value.id), [slugs, value]);

	if (!slugs.length) {
		// TODO: translate
		return <Select placeholder="No slugs available for content type." disabled />;
	}

	if (loading) {
		return <p>sdf</p>;
	}

	return (
		<Flex gap={4}>
			<Box grow={1}>
				<Select placeholder="Select a slug" value={value.id} onChange={onChange}>
					{slugs.map((slug) => (
						<Option key={`${slug.uid}-${slug.id}`} value={slug.id}>
							{slug.slug}
						</Option>
					))}
				</Select>
			</Box>
			{slug && <Link to={`/content-manager/collectionType/${slug.uid}/${slug.id}`}>{slug.slug}</Link>}
		</Flex>
	);
};

export default ComboboxSlugs;
