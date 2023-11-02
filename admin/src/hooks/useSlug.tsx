import { useCallback, useEffect, useState } from 'react';
import { LinkValue } from '../types';
import { useFetchClient } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

const useSlug = (value: Partial<LinkValue>): string | null => {
	const { post } = useFetchClient();
	const [slug, setSlug] = useState<string | null>(null);

	const fetch = useCallback(async () => {
		const { slug }: { slug: string } = (await post(`/${pluginId}/slug`, value)).data;

		setSlug(slug);
	}, [value, setSlug]);

	// Life cycle.
	useEffect(() => {
		if (value && value.id && value.kind && value.uid) {
			fetch();
		} else {
			setSlug(null);
		}
	}, [value?.uid, value?.id]);

	return slug;
};

export default useSlug;
