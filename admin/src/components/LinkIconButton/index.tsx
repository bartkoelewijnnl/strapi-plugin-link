import { DeepPartial, LinkValue } from '../../types';
import useApi from '../../hooks/useApi';
import { Stack } from '@strapi/design-system';
import { LinkButton } from '@strapi/design-system/v2';
import useSlug from '../../hooks/useSlug';
import { useMemo } from 'react';

interface LinkIconButtonProps {
	value: DeepPartial<LinkValue>;
}

const LinkIconButton = ({ value }: LinkIconButtonProps) => {
	// Render.
	const disabled = useMemo(
		() =>
			!value ||
			value.type === 'external' ||
			(value.type === 'internal' && !value.link?.uid) ||
			(value.type === 'internal' && !value.link?.kind),
		[value]
	);
	const href = useMemo(() => {
		if (!value) {
			return '#';
		}

		return value.type === 'internal' && value.link ? `/content-manager/collectionType/${value.link.uid}/${value.link.id}` : '#';
	}, [value]);

	if (!value?.label) {
		return null;
	}

	return (
		<Stack spacing={2}>
			<LinkButton size="S" href={href} disabled={disabled}>
				{value.label}
			</LinkButton>
		</Stack>
	);
};

export default LinkIconButton;
