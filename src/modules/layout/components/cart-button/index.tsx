import { retrieveCart } from '@lib/data/cart';
import CartDropdown from '../cart-dropdown';

export default async function CartButton() {
	const cart = await retrieveCart().catch(() => null);
	// console.log('cart :', cart);

	return <CartDropdown cart={cart} />;
}
