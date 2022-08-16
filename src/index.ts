import 'dotenv/config';
import server from '@/server';

const port = 4444;

server.listen(process.env.PORT || port, () => {
  console.log(`[Server] Listening on: http://localhost:${port}`);
});
