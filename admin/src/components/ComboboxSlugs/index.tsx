import { useEffect } from 'react';
import { Common, Entity, Schema } from '@strapi/strapi';
import { Select, Option, IconButton, Flex, Box } from '@strapi/design-system';
import useApi from '../../hooks/useApi';
import LinkIconButton from '../LinkIconButton';
import { Refresh } from '@strapi/icons';

interface ComboboxSlugsProps {
	value: { uid: Common.UID.ContentType; kind: Schema.ContentTypeKind; id?: Entity.ID; label?: string };
	onChange: (id: Entity.ID) => void;
}

const ComboboxSlugs = ({ value, onChange }: ComboboxSlugsProps) => {
	// TODO: error.
	const { fetchSlugs } = useApi();
	const { data: slugs = [], loading, fetch } = fetchSlugs(value);

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

	if (loading && !slugs.length) {
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
			{value.kind === 'collectionType' && (
				<IconButton disabled={loading} onClick={fetch} label="Refresh slug" icon={<Refresh />} />
			)}
			<LinkIconButton value={value} />
		</Flex>
	);
};

export default ComboboxSlugs;
