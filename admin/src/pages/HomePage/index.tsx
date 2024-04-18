import { AccordionGroup, Switch, Accordion, AccordionToggle, AccordionContent, Box } from '@strapi/design-system';
import useApi from '../../hooks/useApi';
import { useState } from 'react';
import { Common } from '@strapi/strapi';
import { SettingCollectionType, SettingSingleType } from '../../components/settings';
import { Setting } from '../../../../server/types';

const HomePage = () => {
	const { fetchSettings, saveSetting } = useApi();
	const { data, loading } = fetchSettings();
	const [selectedUid, setSelectedUid] = useState<null | Common.UID.ContentType>(null);

	if (!data || loading) {
		return <p>loading todo</p>;
	}

	const handleOnToggle = (uid: Common.UID.ContentType) => {
		if (selectedUid === uid) {
			setSelectedUid(null);
		} else {
			setSelectedUid(uid);
		}
	};

	return (
		<>
			sdf
			<Box padding={8}>
				<AccordionGroup>
					{Object.entries(data).map(([uid, setting]) => (
						<Accordion key={uid} size="S" expanded={selectedUid === uid} onToggle={() => handleOnToggle(uid as Common.UID.CollectionType)}>
							<AccordionToggle title={setting.kind} description={uid} />
							<AccordionContent>
								<Box padding={4} background="white">
									{setting.kind === 'collectionType' && <SettingCollectionType setting={setting} uid={uid as Common.UID.CollectionType} />}
									{setting.kind === 'singleType' && <SettingSingleType setting={setting} uid={uid as Common.UID.SingleType} />}
								</Box>
							</AccordionContent>
						</Accordion>
					))}
				</AccordionGroup>
			</Box>
		</>
	);
};

export default HomePage;
