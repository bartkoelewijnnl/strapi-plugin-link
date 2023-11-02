import { useCallback, useMemo, useState } from 'react';
import { Common, Entity, Schema } from '@strapi/strapi';
import {
	Select,
	Option,
	Flex,
	Box,
	AccordionContent,
	Accordion,
	AccordionToggle,
	Field,
	FieldLabel,
	Stack,
	IconButton,
	TextInput,
} from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import { LinkValue } from '../../types';
import useApi from '../../hooks/useApi';
import ComboboxSlugs from '../ComboboxSlugs';
import LinkIconButton from '../LinkIconButton';
import useSlug from '../../hooks/useSlug';

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
	const [expanded, setExpanded] = useState<boolean>(!value);
	const slug = useSlug(value);

	const { fetchContentTypes } = useApi();
	const { data: contentTypes = [], loading } = fetchContentTypes();

	// Methods.
	const update = useCallback(
		(value: Partial<LinkValue>) => {
			setValue(value);
			onChange({ target: { name, type: 'json', value: JSON.stringify(value) } });
		},
		[onChange]
	);

	//  - Reset.
	// const reset = useCallback(() => {
	// 	update({});
	// }, [update]);

	const resetLink = useCallback(() => {
		update({ ...value, id: undefined, uid: undefined, kind: undefined });
	}, [update]);

	// - Change.
	const handleOnSlugChange = (id: Entity.ID) => {
		if (!value || !value.uid || !value.kind) {
			return;
		}

		update({ ...value, id });
	};

	const handleOnContentTypeChange = async (uid: Common.UID.ContentType) => {
		setValue({
			...value,
			id: undefined,
			uid: uid,
			kind: getKind(contentTypes, uid),
		});
	};

	const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		update({ ...value, label: inputValue });
	};

	// Render.
	const link = useMemo(() => (slug ? `href → ${slug}` : 'Please select a slug'), [slug, value]);

	if (loading) {
		return <p>TODO loading...</p>;
	}

	return (
		<Field name={name} required={false}>
			<Stack spacing={2}>
				<FieldLabel>{name}</FieldLabel>
				<Box padding={6} background="neutral100" borderColor="neutral200" borderRadius="4px">
					<Stack spacing={4}>
						<TextInput value={value?.label} onChange={handleOnInputChange} label="Label" placeholder="Label" />
						<Stack spacing={2}>
							<FieldLabel>Link</FieldLabel>
							<Accordion id="acc-1" expanded={expanded} onToggle={() => setExpanded((s) => !s)} size="S">
								<AccordionToggle
									togglePosition="left"
									title={value?.label || 'Label'}
									description={link}
									action={
										<Flex gap={2}>
											<LinkIconButton value={value} />
											<IconButton onClick={resetLink} label="Reset link" icon={<Trash />} />
										</Flex>
									}
								/>
								<AccordionContent padding={4} background="neutral0">
									<Stack spacing={2}>
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
													label: value.label,
												}}
												onChange={handleOnSlugChange}
											/>
										)}
									</Stack>
								</AccordionContent>
							</Accordion>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Field>
	);
};

export default LinkField;
