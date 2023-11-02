import { useCallback, useMemo, useState } from 'react';
import { Common, Entity, Schema } from '@strapi/strapi';
import { Select, Option, Flex, Box, Field, FieldLabel, GridLayout } from '@strapi/design-system';
import { LinkValue } from '../../types';
import useApi from '../../hooks/useApi';
import ComboboxSlugs from '../ComboboxSlugs';

interface LinkFieldProps {
	value?: string | null;
	onChange: (value: { target: { name: string; type: string; value: string } }) => void;
	name: string;
}

const getKind = (contentTypes: Schema.ContentType[], uid: Common.UID.ContentType | null): Schema.ContentTypeKind | undefined => {
	return (uid && contentTypes.find((contentType) => contentType.uid === uid)?.kind) || undefined;
};

const LinkField = ({ value: initialValue, name, onChange }: LinkFieldProps) => {
	const [value, setValue] = useState<Partial<LinkValue>>(initialValue ? JSON.parse(initialValue) : null);
	const { fetchContentTypes } = useApi();
	const { data: contentTypes = [], loading } = fetchContentTypes();

	// Methods.
	const update = useCallback(
		(value: LinkValue) => {
			onChange({ target: { name, type: 'json', value: JSON.stringify(value) } });
		},
		[onChange],
	);

	const handleOnSlugChange = (id: Entity.ID) => {
		if (!value || !value.uid || !value.kind) {
			return;
		}

		const newValue: LinkValue = {
			id,
			uid: value.uid,
			kind: value.kind,
		};

		setValue(newValue);
		update(newValue);
	};

	const handleOnContentTypeChange = async (uid: Common.UID.ContentType) => {
		setValue({
			id: undefined,
			uid: uid,
			kind: getKind(contentTypes, uid),
		});
	};

	if (loading) {
		return <p>TODO loading...</p>;
	}

	return (
		<Field name={name} required={false}>
			<Flex gap={2} direction="column" alignItems="stretch">
				<Select placeholder="Select a content type." value={value?.uid} onChange={handleOnContentTypeChange}>
					{contentTypes.map((contentType) => (
						<Option key={contentType.uid} value={contentType.uid}>
							{contentType.globalId}
						</Option>
					))}
				</Select>
				{value && value.uid && value.kind && (
					<ComboboxSlugs
						value={{
							id: value.id,
							uid: value.uid,
							kind: value.kind,
						}}
						onChange={handleOnSlugChange}
					/>
				)}
			</Flex>
		</Field>
	);
};

export default LinkField;
