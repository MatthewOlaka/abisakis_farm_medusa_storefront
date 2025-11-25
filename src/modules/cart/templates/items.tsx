import repeat from '@lib/util/repeat';
import { HttpTypes } from '@medusajs/types';
import { Heading, Table } from '@medusajs/ui';

import Item from '@modules/cart/components/item';
import SkeletonLineItem from '@modules/skeletons/components/skeleton-line-item';

type ItemsTemplateProps = {
	cart?: HttpTypes.StoreCart;
};

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
	const items = cart?.items;
	return (
		<div>
			<div className="pb-3 flex items-center">
				<Heading className="text-4xl font-serif text-green-900">Cart</Heading>
			</div>
			<Table>
				<Table.Header className="border-t-0">
					{/* <Table.Row className="text-ui-fg-subtle txt-medium-plus"> */}
					<Table.Row className="!bg-yellow-100">
						<Table.HeaderCell className="!pl-0 text-base md:text-lg text-green-900">
							Item
						</Table.HeaderCell>
						<Table.HeaderCell></Table.HeaderCell>
						<Table.HeaderCell className="text-base md:text-lg text-green-900">
							Quantity
						</Table.HeaderCell>
						<Table.HeaderCell className="hidden small:table-cell text-base md:text-lg text-green-900">
							Price
						</Table.HeaderCell>
						<Table.HeaderCell className="!pr-0 text-right text-base md:text-lg text-green-900">
							Total
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{items
						? items
								.sort((a, b) => {
									return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1;
								})
								.map((item) => {
									return <Item key={item.id} item={item} currencyCode={cart?.currency_code} />;
								})
						: repeat(5).map((i) => {
								return <SkeletonLineItem key={i} />;
							})}
				</Table.Body>
			</Table>
		</div>
	);
};

export default ItemsTemplate;
