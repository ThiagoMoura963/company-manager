import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'node:path';

const env = dotenv.config({
  path: path.resolve(process.cwd(), '../.env.development'),
});

dotenvExpand.expand(env);
