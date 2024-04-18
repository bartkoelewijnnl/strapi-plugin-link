import { useCallback, useEffect, useState } from 'react';
import { DeepPartial, LinkValue } from '../types';
import { useFetchClient } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

const useSlug = (value: DeepPartial<LinkValue>): string | null => {
	const { post } = useFetchClient();
	const [slug, setSlug] = useState<string | null>(null);

	const fetch = useCallback(async () => {
		const { slug }: { slug: string } = (await post(`/${pluginId}/slug`, value?.link)).data;

		setSlug(slug);
	}, [value, setSlug]);

	// Life cycle.
	useEffect(() => {
		if (value && value.type === 'internal' && value.link?.id && value.link.kind && value.link.uid) {
			fetch();
		} else if (value && value.type === 'external' && value.link) {
			setSlug(value.link);
		} else {
			setSlug(null);
		}
	}, [value?.link]);

	return slug;
};

export default useSlug;
