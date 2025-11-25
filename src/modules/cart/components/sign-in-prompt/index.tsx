import { Heading, Text } from '@medusajs/ui';
import { Button } from '@modules/common/components/button';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const SignInPrompt = () => {
	return (
		<div className="bg-yellow-100 flex items-center justify-between">
			<div>
				<Heading level="h2" className="text-xl md:text-3xl font-serif text-green-900 ">
					Already have an account?
				</Heading>
				<Text className="text-sm md:text-md mt-1 text-slate-700">
					Sign in for a better experience.
				</Text>
			</div>
			<div>
				<LocalizedClientLink href="/account">
					<Button
						wrapperClass="px-6 py-1.5 !text-green-900 font-semibold xs:mb-8 rounded-lg border border-amber-300"
						primaryColor="bg-yellow-400 hover:bg-yellow-400/70"
						text="Sign in"
					/>
				</LocalizedClientLink>
			</div>
		</div>
	);
};

export default SignInPrompt;
