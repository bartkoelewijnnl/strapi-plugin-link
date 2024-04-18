import { useState } from 'react';
import type { Setting, SettingCollectionType } from '../../../../server/types';
import { Select, Option, Flex, Button, Badge, Switch } from '@strapi/design-system';
import { Common } from '@strapi/strapi';
import useApi from '../../hooks/useApi';

interface SettingCollectionTypeProps {
	uid: Common.UID.ContentType;
	setting: Setting & SettingCollectionType;
}

const SettingCollectionType = ({ setting, uid }: SettingCollectionTypeProps) => {
	const { saveSetting } = useApi();
	const [attribute, setAttribute] = useState<string | undefined>(setting.attribute);
	const [enabled, setEnabled] = useState<boolean>(!!setting.enabled);

	const handleOnSave = () => {
		saveSetting(uid, { ...setting, attribute, enabled });
	};

	const handleOnSwitchChange = () => {
		setEnabled(!enabled);
	};

	return (
		<Flex gap={2} justifyContent="space-between">
			<Flex direction="column" gap={2} alignItems="start">
				<Switch onLabel="enabled" offLabel="disabled" visibleLabels onChange={handleOnSwitchChange} selected={enabled} />
				{enabled && <Badge>{`/{${attribute ?? ''}}`}</Badge>}
			</Flex>
			<Flex gap={2}>
				{enabled && (
					<Select value={attribute} onChange={setAttribute}>
						{setting.attributes.map((attribute) => (
							<Option key={attribute} value={attribute}>
								{attribute}
							</Option>
						))}
					</Select>
				)}
				<Button type="button" onClick={handleOnSave} size="lg">
					Save
				</Button>
			</Flex>
		</Flex>
	);
};

export default SettingCollectionType;
