import { build } from 'esbuild';

await build({
	loader: {
		'.html': 'text',
	},
});
