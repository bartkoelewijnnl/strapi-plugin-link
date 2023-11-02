import { useEffect } from 'react';
import { Common, Entity, Schema } from '@strapi/strapi';
import { Select, Option, Flex, Box } from '@strapi/design-system';
import useApi from '../../hooks/useApi';
import LinkIconButton from '../LinkIconButton';

interface ComboboxSlugsProps {
	value: { uid: Common.UID.ContentType; kind: Schema.ContentTypeKind; id?: Entity.ID; label?: string };
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
			  }
	);

	// Life cycle.
	useEffect(() => {
		if (slugs.length === 1) {
			onChange(slugs[0].id);
		}
	}, [slugs]);

	// Render.
	if (!slugs.length) {
		// TODO: translate
		return <Select placeholder="No slugs available for content type." disabled />;
	}

	if (loading) {
		return <p>sdf</p>;
	}

	return (
		<Flex gap={2}>
			<Box grow={1}>
				<Select placeholder="Select a slug" value={value.id} onChange={onChange}>
					{slugs.map((slug) => (
						<Option key={`${slug.uid}-${slug.id}`} value={slug.id}>
							{slug.slug}
						</Option>
					))}
				</Select>
			</Box>
			<LinkIconButton value={value} />
		</Flex>
	);
};

export default ComboboxSlugs;
