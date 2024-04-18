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
	Button,
	Link
} from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import { DeepPartial, LinkValue } from '../../types';
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
	const [value, setValue] = useState<DeepPartial<LinkValue>>(initialValue ? JSON.parse(initialValue) : null);
	const [expanded, setExpanded] = useState<boolean>(!value);
	const slug = useSlug(value);

	const { fetchContentTypes } = useApi();
	const { data: contentTypes = [], loading } = fetchContentTypes();

	// Methods.
	const update = useCallback(
		(value: DeepPartial<LinkValue>) => {
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
		update({ ...value, type: 'internal', link: {} });
	}, [update]);

	// - Change.
	const handleOnSlugChange = (id: Entity.ID) => {
		if (
			!value ||
			value.type === 'external' ||
			(value.type === 'internal' && !value.link?.uid) ||
			(value.type === 'internal' && !value.link?.kind)
		) {
			return;
		}

		const newValue: DeepPartial<LinkValue> = {
			...value,
			type: 'internal',
			link: { ...((value.type === 'internal' && value.link) ?? {}), id },
		};

		update(newValue);
	};

	const handleOnContentTypeChange = async (uid: Common.UID.ContentType) => {
		if (!value || value.type === 'external') {
			return;
		}

		const newValue: DeepPartial<LinkValue> = {
			...value,
			type: 'internal',
			link: {
				id: undefined,
				uid,
				kind: getKind(contentTypes, uid),
			},
		};

		setValue(newValue);
	};

	const handleOnTypeChange = (type: string) => {
		if (type === 'internal') {
			update({
				label: value?.label || '',
				target: value?.target || 'self',
				type: 'internal',
				link: {},
			});
		} else if (type === 'external') {
			update({
				label: value?.label || '',
				target: value?.target || 'self',
				type: 'external',
				link: '',
			});
		}
	};

	const handleOnTargetChange = (target: string) => {
		update({ ...value, target: target as 'self' | 'blank' });
	};

	const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		update({ ...value, label: inputValue });
	};

	const handleOnLinkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		update({ ...value, type: 'external', link: inputValue });
	};

	const handleOnAddLinkClick = () => {
		update({
			label: '',
			type: 'internal',
			target: 'self',
			link: {
				id: undefined,
				uid: undefined,
				kind: undefined,
			},
		});
	};

	// Render.
	const link = useMemo(
		() => (slug ? `${slug} ${value?.target === 'blank' ? '(opens a new tab)' : ''}` : 'No link selected'),
		[slug, value]
	);

	if (loading) {
		return <p>TODO loading...</p>;
	}

	return (
		<Field name={name} required={false}>
			<Stack spacing={2}>
				<FieldLabel>{name}</FieldLabel>
				<Box padding={6} background="neutral100" borderColor="neutral200" borderRadius="4px">
					{value === null ? (
						<Button size="M" onClick={handleOnAddLinkClick}>
							Add link
						</Button>
					) : (
						<Stack spacing={4}>
							<TextInput value={value.label} onChange={handleOnInputChange} label="Label" placeholder="Label" />
							<Select required label="Type" placeholder="Type" value={value?.type} onChange={handleOnTypeChange}>
								<Option value="internal">Internal</Option>
								<Option value="external">External</Option>
							</Select>
							{value?.type === 'internal' ? (
								<Stack spacing={1}>
									<FieldLabel required>Link</FieldLabel>
									<Accordion id="acc-1" expanded={expanded} onToggle={() => setExpanded((s) => !s)} size="S">
										<AccordionToggle
											togglePosition="left"
											title={value.label || 'Please insert a label'}
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
												<Select placeholder="Select a content type." value={value.link?.uid} onChange={handleOnContentTypeChange}>
													{contentTypes.map((contentType) => (
														<Option key={contentType.uid} value={contentType.uid}>
															{contentType.globalId}
														</Option>
													))}
												</Select>
												{value && value.link && value.link.uid && value.link.kind && (
													<ComboboxSlugs
														value={{
															id: value.link.id,
															uid: value.link.uid,
															kind: value.link.kind,
															label: value.label,
														}}
														onChange={handleOnSlugChange}
													/>
												)}
											</Stack>
										</AccordionContent>
									</Accordion>
								</Stack>
							) : (
								<>
									<TextInput onChange={handleOnLinkInputChange} value={value.link} label="Link" />
									<Link href={slug} isExternal={value.target === 'blank'}>{slug}</Link>
								</>
							)}
							<Select required label="Target" placeholder="Type" value={value?.target ?? 'self'} onChange={handleOnTargetChange}>
								<Option value="self">Self</Option>
								<Option value="blank">Blank</Option>
							</Select>
						</Stack>
					)}
				</Box>
			</Stack>
		</Field>
	);
};

export default LinkField;
