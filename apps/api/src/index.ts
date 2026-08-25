import { app } from './app.js';
import { env } from './configs/env.js';

app.listen(env.port, () => {
	console.info(`API server listening on port ${env.port}`);
});
