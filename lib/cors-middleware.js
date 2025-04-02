import Cors from "cors";
import initMiddleware from "./init-middleware";

// Allow only GET from ***REMOVED***
const cors = initMiddleware(
  Cors({
    origin: "***REMOVED***",
    methods: ["GET"],
    credentials: true,
  })
);

export default cors;
