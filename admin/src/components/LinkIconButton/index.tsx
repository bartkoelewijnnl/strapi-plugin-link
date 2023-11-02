import { LinkValue } from '../../types';
import useApi from '../../hooks/useApi';
import { Stack } from '@strapi/design-system';
import { LinkButton } from '@strapi/design-system/v2';
import useSlug from '../../hooks/useSlug';
import { useMemo } from 'react';

interface LinkIconButtonProps {
	value: Partial<LinkValue>;
}

const LinkIconButton = ({ value }: LinkIconButtonProps) => {
	// Render.
	const disabled = useMemo(() => !value || !value.id || !value.uid, [value]);
	const href = useMemo(() => {
		if (!value || !value.id || !value.uid) {
			return '#';
		}

		return `/content-manager/collectionType/${value.uid}/${value.id}`;
	}, [value]);

	return (
		<Stack spacing={2}>
			<LinkButton size="S" href={href} disabled={disabled}>
				{value?.label || 'Label'}
			</LinkButton>
		</Stack>
	);
};

export default LinkIconButton;
