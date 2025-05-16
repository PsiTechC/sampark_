import Cors from "cors";
import initMiddleware from "./init-middleware";

// Allow only GET from ***REMOVED***
const cors = initMiddleware(
  Cors({
    origin: "***REMOVED***" || "http://195.250.31.206:4000",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

export default cors;
