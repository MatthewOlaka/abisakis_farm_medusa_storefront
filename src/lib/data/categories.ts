import { sdk } from '@lib/config';
import { HttpTypes } from '@medusajs/types';
import { getCacheOptions } from './cookies';

export const listCategories = async (query?: Record<string, any>) => {
	const next = {
		...(await getCacheOptions('categories')),
	};

	const limit = query?.limit || 100;

	return sdk.client
		.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>('/store/product-categories', {
			query: {
				fields: '*category_children, *products, *parent_category, *parent_category.parent_category',
				limit,
				...query,
			},
			next,
			cache: 'force-cache',
		})
		.then(({ product_categories }) => product_categories);
};

export const getCategoryByHandle = async (categoryHandle: string | string[]) => {
	// const handle = `${categoryHandle.join('/')}`;
	const handle = Array.isArray(categoryHandle) ? categoryHandle.join('/') : categoryHandle;

	const next = {
		...(await getCacheOptions('categories')),
	};

	return sdk.client
		.fetch<HttpTypes.StoreProductCategoryListResponse>(`/store/product-categories`, {
			query: {
				// fields: '*category_children, *products',
				fields: '*category_children, *products, *parent_category, *parent_category.parent_category',

				handle,
			},
			next,
			cache: 'force-cache',
		})
		.then(({ product_categories }) => product_categories[0]);
};

export const listCategoriesForProduct = async (productId: string) => {
	const next = { ...(await getCacheOptions('categories')) };

	return sdk.client
		.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>('/store/product-categories', {
			query: {
				// v2: filter by product id
				product_id: productId,
				// pull useful relations for UI (breadcrumbs, children)
				fields: '*parent_category, *parent_category.parent_category, *category_children',
				limit: 50,
			},
			next,
			cache: 'force-cache',
		})
		.then(({ product_categories }) => product_categories || []);
};
