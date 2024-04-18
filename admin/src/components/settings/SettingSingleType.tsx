import { ChangeEvent, useState } from 'react';
import type { Setting, SettingSingleType } from '../../../../server/types';
import { Switch, Flex, Badge, Button, TextInput } from '@strapi/design-system';
import { Common } from '@strapi/strapi';
import useApi from '../../hooks/useApi';

interface SettingSingleTypeProps {
	uid: Common.UID.ContentType;
	setting: Setting & SettingSingleType;
}

const SettingSingleType = ({ setting, uid }: SettingSingleTypeProps) => {
	const { saveSetting } = useApi();
	const [slug, setSlug] = useState<string>(setting.slug);
	const [enabled, setEnabled] = useState<boolean>(!!setting.enabled);

	const handleOnSave = () => {
		saveSetting(uid, { ...setting, slug, enabled });
	};

	const handleOnSwitchChange = () => {
		setEnabled(!enabled);
	};

	const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSlug(value.replace(/\//g, ''));
	};

	return (
		<Flex gap={2} justifyContent="space-between">
				<Flex direction="column" gap={2} alignItems="start">
				<Switch onLabel="enabled" offLabel="disabled" visibleLabels onChange={handleOnSwitchChange} selected={enabled} />
				{enabled && <Badge>{`/{${slug ?? ''}}`}</Badge>}
			</Flex>
			<Flex gap={2}>
				<TextInput
					id={uid}
					name={uid}
					label="Slug"
					onChange={handleOnInputChange}
					value={slug}
					hint="eg. contact"
				/>
				<Button type="button" onClick={handleOnSave} size="lg">
					Save
				</Button>
			</Flex>
		</Flex>
	);
};

export default SettingSingleType;
