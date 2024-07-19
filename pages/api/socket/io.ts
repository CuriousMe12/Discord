import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextResponseServerIO } from "@/types";

// By default => page router parses the request body
// We are preventing the body to be parsed
export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextResponseServerIO) => {
  // Check if io is added to Nextjs server
  if (!res.socket.server.io) {
    // get route path for sockets
    const path = "/api/socket/io";
    // Cast the next server to http server
    const httpServer: NetServer = res.socket.server as any;
    // pass the http server to Socket for connection
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    // assign the io object to io property of nextjs Server
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
